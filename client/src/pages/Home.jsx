import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe } from '@/components/ui/Globe';
import { Shield, Zap, Users, Award, Clock, CheckCircle, Brain, Code, Sparkles, ArrowRight, FileText, Download } from 'lucide-react';

const testimonials = [
  { name: 'Alex Chen', role: 'Selected Member', text: 'The exam challenge was intense but worth it. Now I\'m part of an amazing coding community!' },
  { name: 'Sarah Kim', role: 'Active Member', text: 'Prepared me for technical interviews. The problems were exactly what I needed.' },
  { name: 'Raj Patel', role: 'Selected Member', text: 'Joint the club last year. Best decision I made in college.' },
];

const Home = () => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [applicants, setApplicants] = useState(156);

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const sections = [
    {
      num: '01',
      title: 'Aptitude & Logical Reasoning',
      questions: 15,
      topics: ['Number Series', 'Probability', 'Ratio & Percentage', 'Logical Puzzles'],
      icon: Brain,
    },
    {
      num: '02',
      title: 'C Programming & Data Structures',
      questions: 15,
      topics: ['Stack, Queue, Linked List', 'Time Complexity', 'Recursion', 'Memory Management'],
      icon: Code,
    },
    {
      num: '03',
      title: 'Programming (Choose One)',
      questions: 15,
      topics: ['Java: OOP, Inheritance, Exception Handling', 'Python: Lists, Sets, Dictionaries, Functions'],
      icon: Sparkles,
    },
  ];

  const rules = [
    'Fullscreen mode is required during the entire exam',
    'Do not switch tabs or minimize the window - violations will be logged',
    'Do not exit fullscreen mode during the exam',
    'Copy, paste, and right-click are disabled',
    'Multiple tab detection is active - opening new tabs will be flagged',
    'Idle time over 2 minutes will be considered suspicious',
    '3-5 violations = Flagged | 5+ violations = Auto disqualification',
    'All questions are mandatory',
    'No malpractice allowed (strict disqualification)',
    'One response per student',
    'Stable internet required',
  ];

  const benefits = [
    'Entry into elite coding club',
    'Real project exposure',
    'Competitive coding environment',
    'Peer learning + mentorship',
  ];

  const targets = [
    'Students serious about coding',
    'Beginners wanting structured growth',
    'Competitive programming aspirants',
    'Anyone who wants to stand out',
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-violet-500/30 rounded-full blur-[128px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300 backdrop-blur-sm">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                Codecraft Coding Club @ SRGI
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30">
                  TOP 20% SELECTED ONLY
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Crack the Code.{' '}
                <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Join the Elite.
                </span>
              </h1>
              
              <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
                Get selected into Codecraft Coding Club SRGI by proving your skills in logic, coding, and problem-solving.
              </p>

              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-violet-400" />
                  <span>{applicants}+ Students Applied</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105"
                >
                  Register for Exam
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/#syllabus"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10"
                >
                  View Syllabus
                </Link>
              </div>

              {/* Countdown Timer */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-sm text-slate-400 mb-3">Exam Registration Ends In:</p>
                <div className="flex gap-4">
                  {Object.entries(countdown).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-white">{value.toString().padStart(2, '0')}</div>
                      <div className="text-xs text-slate-500 uppercase">{key}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-3xl blur-2xl" />
              <Globe size={500} dotColor="rgba(167, 139, 250, ALPHA)" arcColor="rgba(139, 92, 246, 0.4)" markerColor="rgba(167, 139, 250, 1)" />
            </div>
          </div>
        </div>
      </section>

      {/* About The Exam */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-violet-400 font-medium tracking-wider uppercase text-sm">About The Exam</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
              Codecraft Coding Club{' '}
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Entrance Exam</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-3xl mx-auto text-lg">
              A competitive selection process designed to identify top talent in Logical Thinking, Problem Solving, and Programming Fundamentals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-4xl font-bold text-violet-400">45</p>
              <p className="text-slate-400">Total Questions</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-4xl font-bold text-indigo-400">3</p>
              <p className="text-slate-400">Sections</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-4xl font-bold text-purple-400">Online</p>
              <p className="text-slate-400">Mode (Google Form)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Structure */}
      <section id="syllabus" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-violet-400 font-medium tracking-wider uppercase text-sm">Exam Structure</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
              Three Sections,{' '}
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">One Goal</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
              45 Questions | 60-90 mins | Moderate to Advanced Difficulty
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {sections.map((section, idx) => (
              <div key={idx} className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="text-6xl font-bold text-violet-500/10 absolute -top-4 -left-2">{section.num}</div>
                  <div className="size-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center mb-4">
                    <section.icon className="size-6 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{section.title}</h3>
                  <p className="text-violet-400 font-semibold mb-4">{section.questions} Questions</p>
                  <ul className="space-y-2">
                    {section.topics.map((topic, i) => (
                      <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                        <CheckCircle className="size-3 text-violet-400" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-center">
            <p className="text-amber-400 font-semibold text-lg">Important: Attempt only one language track in Section 3</p>
          </div>
        </div>
      </section>

      {/* Why This Exam Matters */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-violet-400 font-medium tracking-wider uppercase text-sm">Why This Exam Matters</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                This is not just an exam —{' '}
                <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">it's a talent filter</span>
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                Join an elite group of coders and accelerate your journey in the tech industry.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                      <CheckCircle className="size-4 text-violet-400" />
                    </div>
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-3xl blur-2xl" />
              <div className="relative p-8 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Who Should Apply</h3>
                <ul className="space-y-4">
                  {targets.map((target, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-300">
                      <div className="size-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold">
                        {idx + 1}
                      </div>
                      {target}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules & Guidelines */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-red-400 font-medium tracking-wider uppercase text-sm">Rules & Guidelines</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
              Please Read Carefully
            </h2>
          </div>
          
          <div className="bg-red-500/10 rounded-2xl border border-red-500/30 p-8">
            <ul className="space-y-4">
              {rules.map((rule, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-300">
                  <Shield className="size-5 text-red-400" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-400">
              <Clock className="inline size-4 mr-2" />
              Duration: 60-90 mins | Platform: Google Form
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-violet-400 font-medium tracking-wider uppercase text-sm">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
              What Members{' '}
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Say</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-slate-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-300 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Prove Your Skills?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Don't miss your chance to join the Codecraft Coding Club
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-violet-600 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Register Now
            </Link>
            <Link
              to="/status"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white rounded-xl font-semibold hover:bg-white/10 transition-all border-2 border-white/30"
            >
              <Download className="size-5" />
              Check Selection Status
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/70">
            {['Not everyone gets in.', 'Top coders only.', 'Filtered. Selected. Elite.'].map((tagline, idx) => (
              <span key={idx} className="px-4 py-2 bg-white/10 rounded-full text-sm">
                {tagline}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">Code<span className="text-violet-400">craft</span></span>
              <span className="text-slate-500 text-sm">@ SRGI</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2024 Codecraft Coding Club. Elite selection process.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;