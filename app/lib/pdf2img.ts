export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('PDFJS can only run in the browser');
  }

  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  loadPromise = Promise.all([
    import('pdfjs-dist/build/pdf.mjs'),
    import('pdfjs-dist/build/pdf.worker.mjs?url'),
  ]).then(([lib, workerUrl]) => {
    lib.GlobalWorkerOptions.workerSrc = workerUrl.default;
    pdfjsLib = lib;
    return lib;
  });

  return loadPromise;
}


export async function convertPdfToImage(
  file: File,
): Promise<PdfConversionResult> {
  try {
    console.log('PDF2IMG: loading pdfjs');
    const lib = await loadPdfJs();

    console.log('PDF2IMG: reading file');
    const arrayBuffer = await file.arrayBuffer();

    console.log('PDF2IMG: parsing pdf');
    const pdf = await lib.getDocument({
      data: arrayBuffer,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${lib.version}/cmaps/`,
      cMapPacked: true,
    }).promise;

    console.log('PDF2IMG: loading page');
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 3 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) throw new Error('Canvas context unavailable');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    console.log('PDF2IMG: rendering');
    await page.render({ canvasContext: context, viewport }).promise;

    console.log('PDF2IMG: converting to image');
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject('toBlob failed')),
        'image/png',
      );
    });

    return {
      imageUrl: URL.createObjectURL(blob),
      file: new File([blob], file.name.replace(/\.pdf$/i, '') + '.png', {
        type: 'image/png',
      }),
    };
  } catch (err) {
    console.error('PDF2IMG ERROR:', err);
    return {
      imageUrl: '',
      file: null,
      error: String(err),
    };
  }
}
