
import { type FormEvent, useState, useRef, useEffect } from 'react';
import Navbar from '~/components/Navbar';
import FileUploader from '~/components/FileUploader';
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from '~/lib/pdf2img';
import { generateUUID } from '~/lib/utils';
import { AIResponseFormat, prepareInstructions } from '../../constants';
import gsap from 'gsap';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('Idle');
  const [file, setFile] = useState<File | null>(null);

  // Animation Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const updateStatus = (text: string) => {
    setStatusText(text);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);

    // Initial Loading Animation
    gsap.to(formRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      display: 'none',
      onComplete: () => {
        gsap.fromTo(loadingRef.current,
          { opacity: 0, scale: 0.9, display: 'none' },
          { opacity: 1, scale: 1, duration: 0.5, display: 'flex' }
        );
      }
    });

    updateStatus('Uploading file...');
    console.log('Uploading file:', file);
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return updateStatus('Error: Failed to upload file');

    updateStatus('Converting PDF to image...');
    const imageFile = await convertPdfToImage(file);
    console.log('Starting PDF → Image conversion');

    if (!imageFile.file)
      return updateStatus('Error: Failed to convert PDF to image');

    updateStatus('Uploading image assets...');
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return updateStatus('Error: Failed to upload image');

    updateStatus('Structuring data...');
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: '',
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    updateStatus('AI Analysis in progress...');

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({
        jobTitle,
        jobDescription,
        AIResponseFormat,
      }),
    );

    if (!feedback) return updateStatus('Error: Failed to analyze resume');

    const feedbackText =
      typeof feedback.message.content === 'string'
        ? feedback.message.content
        : feedback.message.content[0].text;

    let parsedFeedback;

    try {
      parsedFeedback = JSON.parse(feedbackText);
    } catch (err) {
      console.error('Invalid AI JSON:', feedbackText);
      updateStatus('Error: AI returned invalid JSON');
      return;
    }

    data.feedback = parsedFeedback;
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  // Intro Animation
  useEffect(() => {
    if (!isProcessing) {
      const ctx = gsap.context(() => {
        gsap.from(containerRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: 'power3.out'
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isProcessing]);

  return (
    <main className="relative min-h-screen bg-brand-dark overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />

      <section className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[80vh]">

        {/* Processing State */}
        <div ref={loadingRef} className="hidden flex-col items-center gap-8 text-center max-w-md w-full">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full animate-pulse" />
            <div className="relative glass p-8 rounded-full">
              <Loader2 className="w-16 h-16 text-brand-primary animate-spin" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">
              Parsing Resume
            </h2>
            <p className="text-xl text-text-muted font-light">{statusText}</p>
          </div>

          {/* Progress Steps Visual */}
          <div className="flex flex-col gap-4 w-full mt-8">
            {['Uploading file', 'Converting PDF', 'AI Analysis'].map((step, i) => (
              <div key={step} className="flex items-center gap-4 text-left p-3 rounded-lg bg-white/5">
                {statusText.toLowerCase().includes(step.split(' ')[0].toLowerCase()) ? (
                  <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-600" />
                )}
                <span className="text-sm font-medium text-gray-200">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div ref={containerRef} className={`${isProcessing ? 'hidden' : 'block'} w-full max-w-4xl`}>
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Upload Your Resume
            </h1>
            <p className="text-text-muted text-lg">
              Get instant AI feedback on your resume tailored for specific job roles.
            </p>
          </div>

          <div className="glass-card p-1">
            <form
              ref={formRef}
              id="upload-form"
              onSubmit={handleSubmit}
              className="bg-brand-dark/50 backdrop-blur-xl rounded-xl p-8 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10"
            >
              {/* Left Column: Job Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary text-sm">1</span>
                    Job Details
                  </h3>
                  <div className="space-y-5">
                    <div className="form-div">
                      <label htmlFor="company-name">Target Company</label>
                      <input
                        type="text"
                        name="company-name"
                        placeholder="e.g. Google, Microsoft"
                        id="company-name"
                      />
                    </div>
                    <div className="form-div">
                      <label htmlFor="job-title">Job Title</label>
                      <input
                        type="text"
                        name="job-title"
                        placeholder="e.g. Senior Frontend Engineer"
                        id="job-title"
                      />
                    </div>
                    <div className="form-div">
                      <label htmlFor="job-description">Job Description</label>
                      <textarea
                        rows={6}
                        name="job-description"
                        placeholder="Paste the JD here for better context..."
                        id="job-description"
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: File Upload */}
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-secondary/20 text-brand-secondary text-sm">2</span>
                  Resume File
                </h3>

                <div className="flex-1 flex flex-col">
                  <FileUploader onFileSelect={handleFileSelect} />

                  <div className="mt-8">
                    <button
                      className="primary-button w-full flex items-center justify-center gap-2 text-lg h-14"
                      type="submit"
                      disabled={!file}
                    >
                      Begin Analysis
                      <div className="p-1 bg-white/20 rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};
export default Upload;
