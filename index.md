---
layout: default
---

<div class="home">
  <header class="site-header">
    <div class="wrapper">
      <h1 class="site-title">{{ site.title }}</h1>
      <p class="site-description">{{ site.description }}</p>
      <nav class="site-nav">
        <a href="#about" class="page-link">About</a>
        <a href="#skills" class="page-link">Skills</a>
        <a href="#projects" class="page-link">Projects</a>
        <a href="#contact" class="page-link">Contact</a>
      </nav>
    </div>
  </header>

  <main class="page-content" aria-label="Content">
    <div class="wrapper">
      <section id="about" class="section">
        <h2>About Me</h2>
        <div class="profile-content">
          <p>✌︎㋡ hello 👋 i'm <strong>shadrackovsky timothy john</strong>, i am an aspiring <strong>ai - ml</strong> and <strong>software engineer</strong> from tanzania 🤓🇹🇿, doing web applications development, machine learning, retrieval-augmented generation, models fine-tuning and building systems around frontier ai models.</p>
          
          <p>✌︎㋡ i didn't grow up with a computer in my room until my lovely grandmother in heaven bought me my first laptop (second-hand old elitebook) when i joined college.</p>
          
          <p>✌︎㋡ i've built this journey fueled by tiring, long nights, insatiable curiosity, and a genuine love for understanding how things work and connected since i was a young boy.</p>
          
          <p>✌︎㋡ i'm obsessed with karpathy, ilya, lecun, andrew ng, bengio, radford, ian goodfellow, alex krizhevsky, georgi gerganov.</p>
        </div>
      </section>

      <section id="skills" class="section">
        <h2>Technologies I Use</h2>
        <div class="skills-grid">
          <div class="skill-category">
            <h3>Languages & Core</h3>
            <div class="skill-icons">
              <img src="https://skillicons.dev/icons?i=python,django,js,ts,cpp,bash,html,css&perline=8" alt="Core skills">
            </div>
          </div>
          <div class="skill-category">
            <h3>Frameworks & Tools</h3>
            <div class="skill-icons">
              <img src="https://skillicons.dev/icons?i=java,react,fastapi,tailwind,vite&perline=8" alt="Frameworks">
            </div>
          </div>
          <div class="skill-category">
            <h3>AI & Data</h3>
            <div class="skill-icons">
              <img src="https://skillicons.dev/icons?i=anaconda,pytorch,tensorflow,sklearn,opencv&perline=8" alt="AI/Data">
            </div>
          </div>
          <div class="skill-category">
            <h3>Cloud & DevOps</h3>
            <div class="skill-icons">
              <img src="https://skillicons.dev/icons?i=apple,postgres,mysql,sqlite,git,github,gitlab,supabase,docker,githubactions,linux,arduino,vscode,npm,notion,vercel,netlify&perline=8" alt="Cloud/DevOps">
            </div>
          </div>
        </div>
      </section>

      <section id="roadmap" class="section">
        <h2>Current Focus</h2>
        <table class="roadmap-table">
          <thead>
            <tr><th>Field</th><th>What I'm Mastering</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>GenAI & LLMs</strong></td><td>fine-tuning (lora/qlora), rag systems, chroma vector db, hugging face</td></tr>
            <tr><td><strong>Python & Data</strong></td><td>fastapi, pandas, numpy, pytorch, ai models and large dataset trainings</td></tr>
            <tr><td><strong>Data Engineering</strong></td><td>sql, data cleaning, pipelining, api integration</td></tr>
            <tr><td><strong>Cloud & DevOps</strong></td><td>docker, kubernetes, git</td></tr>
            <tr><td><strong>Frontend</strong></td><td>react, next, vite, tailwind css, shadcn-ui</td></tr>
            <tr><td><strong>Backend</strong></td><td>supabase, django, springboot</td></tr>
            <tr><td><strong>Desktop Apps</strong></td><td>tauri, electron, pyqt, tkinter, rust</td></tr>
            <tr><td><strong>Computational Finance</strong></td><td>quantitative modeling, algorithmic trading, risk analysis, portfolio optimization</td></tr>
          </tbody>
        </table>
      </section>

      <section id="projects" class="section">
        <h2>Featured Projects</h2>
        <div class="projects-grid">
          <article class="project-card">
            <h3><a href="https://github.com/zuck30/Malaika">Malaika</a></h3>
            <p>My AI companion</p>
            <img src="{{ '/assets/malaika.webp' | relative_url }}" alt="Malaika screenshot" class="project-image">
          </article>
          <article class="project-card">
            <h3><a href="https://github.com/zuck30/swahili-llm-scratch">Swahili-GPT</a></h3>
            <p>Swahili language model pre-trained from scratch</p>
            <img src="{{ '/assets/swahili.webp' | relative_url }}" alt="Swahili LM screenshot" class="project-image">
          </article>
          <article class="project-card">
            <h3><a href="https://github.com/zuck30/SWAHIBA">SWAHIBA</a></h3>
            <p>Bootstrapping Swahili-LM with DeepSeek API</p>
            <img src="{{ '/assets/swahiba.webp' | relative_url }}" alt="SWAHIBA screenshot" class="project-image">
          </article>
          <article class="project-card">
            <h3><a href="https://aibruno.vercel.app/">Bruno</a></h3>
            <p>Chat agents component library</p>
            <img src="{{ '/assets/bruno-photoroom.webp' | relative_url }}" alt="Bruno screenshot" class="project-image">
          </article>
          <article class="project-card">
            <h3><a href="https://smarbodigital.co.tz">Smarbo Digital</a></h3>
            <p>Event management platform - invitations, contributions, attendance</p>
            <img src="{{ '/assets/smarbo-digital.webp' | relative_url }}" alt="Smarbo Digital" class="project-image">
          </article>
          <article class="project-card">
            <h3><a href="https://ajiraconnect.co.tz">Ajira Connect</a></h3>
            <p>Talent management platform for Tanzanian career seekers</p>
            <img src="{{ '/assets/ajira-0.webp' | relative_url }}" alt="Ajira Connect" class="project-image">
          </article>
          <article class="project-card">
            <h3>Sauti Connect</h3>
            <p>Customer service call center management</p>
            <img src="{{ '/assets/sauti-1.webp' | relative_url }}" alt="Sauti Connect" class="project-image">
          </article>
          <article class="project-card">
            <h3>PimaFarm</h3>
            <p>Smart farming platform for tractor/machine monitoring</p>
            <img src="{{ '/assets/pima.webp' | relative_url }}" alt="PimaFarm" class="project-image">
          </article>
          <article class="project-card">
            <h3>AfyaOS</h3>
            <p>Healthcare operating system</p>
            <img src="{{ '/assets/afyaos.webp' | relative_url }}" alt="AfyaOS" class="project-image">
          </article>
        </div>
      </section>

      <section id="desk-setup" class="section">
        <h2>Desk Setup</h2>
        <div class="setup-images">
          <img src="{{ '/assets/setup.webp' | relative_url }}" alt="Desk setup" class="setup-image">
          <img src="{{ '/assets/setup-2.webp' | relative_url }}" alt="Desk setup 2" class="setup-image">
        </div>
      </section>

      <section id="contact" class="section">
        <h2>Get In Touch</h2>
        <p>Open for freelance contracts in AI/ML and web development, open-source AI collaborations, remote software engineering roles.</p>
        <p>📩 <a href="mailto:mwalyangashadrack@gmail.com">mwalyangashadrack@gmail.com</a></p>
        <div class="social-links">
          <a href="https://sheddysilicon.netlify.app" target="_blank">Portfolio</a>
          <a href="https://sheddydev.netlify.app/" target="_blank">Blog</a>
          <a href="https://github.com/zuck30" target="_blank">GitHub</a>
          <a href="https://instagram.com/sheddysilicon" target="_blank">Instagram</a>
          <a href="https://antera.co.tz" target="_blank">Antera</a>
        </div>
      </section>

      <section id="hire" class="section">
        <h2>Hire Me</h2>
        <p align="center">
          <a href="https://github.com/zuck30">
            <img src="{{ '/assets/setup.webp' | relative_url }}" alt="Desk setup" width="800" class="hire-image">
          </a>
        </p>
        <p align="center">
          <a href="https://github.com/zuck30">
            <img src="{{ '/assets/setup-2.webp' | relative_url }}" alt="Desk setup 2" width="800" class="hire-image">
          </a>
        </p>
      </section>
    </div>
  </main>

  <footer class="site-footer">
    <div class="wrapper">
      <p>&copy; {{ site.time | date: '%Y' }} {{ site.title }}</p>
    </div>
  </footer>
</div>