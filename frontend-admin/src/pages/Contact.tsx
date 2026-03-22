import type { JSX } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Contact = (): JSX.Element => {
  return (
      <div className="h-full overflow-y-auto bg-slate-950 text-white px-6 py-10">
        <div className="max-w-6xl mx-auto min-h-full flex flex-col justify-center">
          {/* HEADER */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-purple-500 mb-4">About Me</h1>

            <p className="text-slate-400 max-w-2xl mx-auto">
              AI Engineer specializing in Retrieval-Augmented Generation, Semantic
              Search and Data Engineering systems.
            </p>
          </div>

          {/* MAIN GRID */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* PROFILE */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Profile</h2>

              <p className="text-slate-400 mb-6">
                Passionate AI Engineer with strong background in Machine Learning,
                RAG architectures, vector databases and backend systems.
                Experienced in building production-ready AI applications using
                FastAPI, FAISS, and modern LLMs.
              </p>

              <p className="text-slate-400">
                Strong mathematical foundation in linear algebra, probability
                theory and optimization — applied to real-world AI and data
                systems.
              </p>
            </div>

            {/* SKILLS */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Core Skills
              </h2>

              <ul className="space-y-3 text-slate-400">
                <li>• Retrieval-Augmented Generation (RAG)</li>
                <li>• Vector Databases (FAISS, Embeddings)</li>
                <li>• FastAPI & Backend Systems</li>
                <li>• Data Engineering Pipelines</li>
                <li>• Python & LLM Integration</li>
                <li>• Linear Algebra & Probability</li>
              </ul>
            </div>
          </div>

          {/* CONTACT SECTION */}
          <div className="mt-12 bg-slate-900 p-10 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold text-purple-500 mb-8 text-center">
              Contact Information
            </h2>

            <div className="grid md:grid-cols-2 gap-8 text-slate-300">
              {/* EMAIL */}
              <div className="flex items-center gap-3">
                <MdEmail className="text-purple-400 text-lg" />
                <span>Email: med.abdelkader.ketata@gmail.com</span>
              </div>

              {/* SOCIAL LINKS */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaGithub className="text-purple-400 text-lg" />
                  <a
                      href="https://github.com/MedKetata"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-purple-400 transition"
                  >
                    github.com/MedKetata
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <FaLinkedin className="text-purple-400 text-lg" />
                  <a
                      href="https://www.linkedin.com/in/mohamed-abdelkader-ketata-4955a42b8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-purple-400 transition"
                  >
                    linkedin.com/in/mohamed-abdelkader-ketata
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Contact;