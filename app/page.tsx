"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

type FeatureType = {
  id: string;
  title: string;
  description: string;
};

const HomePage: React.FC = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(typeof window !== "undefined");
  }, []);

  const features: FeatureType[] = [
    {
      id: "01",
      title: "Courses",
      description: "Structured learning paths with customized curricula",
    },
    {
      id: "02",
      title: "Ai Lectures",
      description: "Adaptive lessons with real-time adjustments",
    },
    {
      id: "03",
      title: "Assignments",
      description: "Auto-graded tasks with instant feedback",
    },
    {
      id: "04",
      title: "Study material",
      description: "Curated resources in multiple formats",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Choose Your Topic",
      text: "Select from hundreds of curated learning paths or create your own",
    },
    {
      number: "02",
      title: "Interact with DeepTutor",
      text: "Engage in natural conversations powered by Gemini AI",
    },
    {
      number: "03",
      title: "Practice with Assignments",
      text: "Reinforce learning with AI-generated exercises",
    },
    {
      number: "04",
      title: "Track Progress",
      text: "Monitor your learning journey with detailed analytics",
    },
  ];

  const testimonials = [
    {
      id: 1,
      text: "The DeepTutor revolutionized how I study!",
      author: "Sarah Johnson",
      role: "Computer Science Student",
    },
    {
      id: 2,
      text: "Feels like having a personal teacher 24/7",
      author: "Michael Chen",
      role: "High School Student",
    },
    {
      id: 3,
      text: "Best investment in education I've made",
      author: "Dr. Emily Rodriguez",
      role: "Lifelong Learner",
    },
  ];

  const faqs = [
    {
      question: "How does the DeepTutor work?",
      answer:
        "Our AI combines Gemini's intelligence with interactive learning methods...",
    },
    {
      question: "Can I try before subscribing?",
      answer: "You don't need any subscription, just buy the course you want to learn...",
    },
    {
      question: "What subjects are covered?",
      answer: "We cover Programming subjects, languages, humanities, and more...",
    },
    {
      question: "Is my progress saved?",
      answer: "All your learning progress is securely stored in the cloud...",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="py-20 px-6 md:px-12 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 text-center md:text-left">
            {isMounted ? (
              <motion.h1
                className="text-5xl font-bold text-gray-800 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Learn Smarter with Your{" "}
                <span className="text-violet-400">DeepTutor</span>
              </motion.h1>
            ) : (
              <h1 className="text-5xl font-bold text-gray-800 mb-6">
                Learn Smarter with Your DeepTutor
              </h1>
            )}
            <p className="text-xl text-gray-600 mb-8">
              Personalized learning powered by Gemini AI and interactive virtual
              tutoring
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link href="/dashboard">
                <Button className="px-8 py-4 text-lg bg-gray-950 hover:bg-white border border-gray-950 hover:text-gray-950">
                  Start Learning
                </Button>
              </Link>
              {/* <Button
                variant="outline"
                className="px-8 py-4 text-lg border-gray-800"
              >
                How It Works
              </Button> */}
            </div>
          </div>
          <div className="md:w-1/2 ml-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/avatar-demo.png"
                alt="DeepTutor in action"
                width={450}
                height={400}
                className="rounded-lg"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid (Existing) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {features.map((feature: FeatureType, index: number) => {
              // Predefined Tailwind classes in order
              const backgroundClasses = [
                "bg-violet-50/50",
                "bg-violet-100",
                "bg-violet-200",
                "bg-violet-300",
              ];

              return (
                <div
                  key={index}
                  className={`${backgroundClasses[index]} p-6 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:scale-110`}
                >
                  <h2 className="text-2xl font-bold text-purple-600">
                    {feature.id}
                  </h2>
                  <h3 className="text-lg font-semibold text-gray-800 mt-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold mb-4">
              Transform Your Learning Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the future of education with our AI-powered learning flow
            </p>
          </motion.div>

          <div className="relative grid gap-12 md:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative [perspective:1000px]"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-200 to-blue-200 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
                {/* Front Face */}
                <div className="relative bg-white rounded-2xl p-8 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-xl font-bold text-purple-600">
                        {step.number}
                      </span>
                    </div>
                    <svg
                      className="w-8 h-8 text-purple-600 hidden md:block"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M13 6h6m-6 6h6m-6 6h6M3 6h12M3 12h9M3 18h7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.text}</p>
                </div>
                
              </motion.div>
            ))}
          </div>

          {/* <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-16"
          >
            <Button className="rounded-full px-8 py-4 text-lg bg-purple-600 hover:bg-purple-700">
              Start Your Free Trial
            </Button>
          </motion.div> */}
        </div>
      </section>

      {/* Interactive Avatar Section */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 ">
            <Image
              src="/agent-demo.png"
              alt="DeepTutor in action"
              width={270}
              height={350}
              className="bg-white rounded-lg shadow-lg p-4 pb-0"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-6">Meet Your DeepTutor</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our virtual tutor uses natural language processing and realistic
              avatars to create an immersive learning experience. Ask questions,
              get explanations, and practice conversations in real-time.
            </p>
            <div className="flex gap-4">
              <Button className="px-6 py-3">Try Live Demo</Button>
              <Button variant="outline" className="px-6 py-3">
                See Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            What Students Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="p-8 bg-white rounded-xl shadow-lg flex flex-col justify-between hover:scale-110 transition-transform duration-300"
              >
                <p className="text-gray-600 mb-6">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="border-t pt-4">
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-white rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-violet-50">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-8">
            Start Your Learning Journey Today
          </h2>
          <p className="text-xl mb-12">
            Join thousands of students already transforming their education
          </p>
          <Link href="/signup">
            <Button
              className="px-12 py-6 text-lg text-black  font-medium"
              variant={"outline"}
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-black border-t text-gray-400 border-gray-300">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm sm:text-center">
            © 2025{" "}
            <Link href={"/"} className="hover:underline">
              DeepTutor™
            </Link>
            . All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-400 sm:mt-0">
            <li>
              <Link href="#" className="hover:underline me-4 md:me-6">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
