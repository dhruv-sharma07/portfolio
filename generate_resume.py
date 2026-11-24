# python script to generate standard clean Resume_Dhruv_Sharma.pdf
import sys

def build_pdf(filename):
    lines_content = []
    
    # PDF commands builder
    stream_cmds = []
    
    # Coordinates in points (612 x 792 for Letter)
    # Origin (0,0) is bottom-left
    
    def add_text(x, y, text, font="F1", size=10, r=0.1, g=0.1, b=0.1):
        # Escape parenthesis and sanitize unicode
        safe_text = text.replace('\u2014', '--').replace('\u2013', '-').replace('\u2018', "'").replace('\u2019', "'").replace('\u2022', '*')
        clean_text = safe_text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
        stream_cmds.append(f"{r:.3f} {g:.3f} {b:.3f} rg")
        stream_cmds.append("BT")
        stream_cmds.append(f"/{font} {size} Tf")
        stream_cmds.append(f"{x:.2f} {y:.2f} Td")
        stream_cmds.append(f"({clean_text}) Tj")
        stream_cmds.append("ET")

    def add_line(x1, y1, x2, y2, r=0.8, g=0.8, b=0.8, width=1):
        stream_cmds.append(f"{r:.3f} {g:.3f} {b:.3f} RG")
        stream_cmds.append(f"{width} w")
        stream_cmds.append(f"{x1:.2f} {y1:.2f} m {x2:.2f} {y2:.2f} l S")

    # Header
    top_y = 745
    add_text(50, top_y, "DHRUV SHARMA", font="F2", size=22, r=0.06, g=0.09, b=0.16)
    add_text(50, top_y - 18, "Full-Stack Developer & AI Solutions Engineer", font="F2", size=11, r=0.95, g=0.65, b=0.24)
    
    contact_info = "dhruvsharma71105@gmail.com  |  linkedin.com/in/dhruv-sharma07  |  github.com/dhruv-sharma07  |  India"
    add_text(50, top_y - 34, contact_info, font="F1", size=9, r=0.4, g=0.45, b=0.55)
    
    add_line(50, top_y - 44, 562, top_y - 44, r=0.85, g=0.87, b=0.92, width=1.2)
    
    curr_y = top_y - 65

    # Section Helper
    def draw_section_heading(y, title):
        add_text(50, y, title.upper(), font="F2", size=11, r=0.1, g=0.15, b=0.25)
        add_line(50, y - 4, 562, y - 4, r=0.42, g=0.55, b=1.0, width=1.5)
        return y - 18

    # 1. SUMMARY
    curr_y = draw_section_heading(curr_y, "Professional Summary")
    summary_text = [
        "Dynamic Full-Stack Developer & AI Engineer with expertise in building scalable web architectures,",
        "production LLM workflows, and human-centric intelligent applications. Proven track record in developing",
        "India's AI Legal Advisor (NyayaBot), autonomous agent pipelines, and high-performance reactive web apps."
    ]
    for s in summary_text:
        add_text(50, curr_y, s, font="F1", size=9.5, r=0.2, g=0.25, b=0.3)
        curr_y -= 14
    curr_y -= 8

    # 2. TECHNICAL SKILLS
    curr_y = draw_section_heading(curr_y, "Technical Skills")
    skills = [
        ("Languages:", "Python, TypeScript, JavaScript, C++, SQL (PostgreSQL, SQLite), HTML5, CSS3"),
        ("AI / ML & LLMs:", "Agentic AI, LLM Pipelines, RAG Architectures, LangChain, PyTorch, OpenAI API, Prompt Eng."),
        ("Web Development:", "Next.js, React.js, Node.js, Express, Tailwind CSS, RESTful APIs, State Management"),
        ("Databases & Cloud:", "PostgreSQL, Prisma ORM, MongoDB, Redis, Docker, Vercel, Git, GitHub Actions, Linux")
    ]
    for cat, val in skills:
        add_text(50, curr_y, cat, font="F2", size=9.5, r=0.1, g=0.15, b=0.25)
        add_text(160, curr_y, val, font="F1", size=9.5, r=0.25, g=0.3, b=0.35)
        curr_y -= 14
    curr_y -= 8

    # 3. FEATURED PROJECTS
    curr_y = draw_section_heading(curr_y, "Featured Projects")
    
    projects = [
        {
            "name": "NyayaBot — India's AI Legal Advisor",
            "tech": "Python, AI/NLP, Multi-Act Vector Search, FastAPI",
            "date": "2024 – Present",
            "bullets": [
                "Engineered a zero-config AI advisor bridging legal accessibility across IPC, CrPC, BNS 2024, and 200+ Indian Acts.",
                "Implemented hybrid semantic retrieval and contextual RAG with citations, delivering reliable legal summaries.",
                "Designed responsive, lightweight conversational interface reducing legal research turn-around time drastically."
            ]
        },
        {
            "name": "Wardrobe AI — Smart Digital Styling & Wardrobe Intelligence",
            "tech": "Next.js, TypeScript, Tailwind CSS, Prisma, Multimodal AI",
            "date": "2024",
            "bullets": [
                "Built an intelligent web application providing context-aware outfit recommendations based on weather and events.",
                "Integrated multimodal computer vision pipelines to automatically segment and classify clothing catalog items.",
                "Engineered responsive UI with dark/light themes, smooth transitions, and high-performance server rendering."
            ]
        },
        {
            "name": "Harbor Click Pipeline — Benchmark Automation Suite",
            "tech": "Python, Docker, PyProject, Automation Frameworks",
            "date": "2024",
            "bullets": [
                "Developed high-throughput data extraction and evaluation pipeline for automated system benchmarking.",
                "Containerized pipeline execution via Docker, enabling reproducible test runs and unified reporting metrics."
            ]
        }
    ]

    for p in projects:
        add_text(50, curr_y, p["name"], font="F2", size=10.5, r=0.08, g=0.12, b=0.2)
        add_text(480, curr_y, p["date"], font="F1", size=9, r=0.45, g=0.5, b=0.6)
        curr_y -= 13
        add_text(50, curr_y, f"Tech Stack: {p['tech']}", font="F3", size=9, r=0.4, g=0.45, b=0.55)
        curr_y -= 13
        for b in p["bullets"]:
            add_text(60, curr_y, "[*]", font="F1", size=8, r=0.95, g=0.65, b=0.24)
            add_text(75, curr_y, b, font="F1", size=9.2, r=0.2, g=0.25, b=0.3)
            curr_y -= 13
        curr_y -= 5

    # 4. EDUCATION
    curr_y = draw_section_heading(curr_y, "Education")
    add_text(50, curr_y, "Bachelor of Technology (B.Tech) - Computer Science & Engineering", font="F2", size=10, r=0.1, g=0.15, b=0.25)
    add_text(480, curr_y, "2022 – 2026", font="F1", size=9, r=0.45, g=0.5, b=0.6)
    curr_y -= 13
    add_text(50, curr_y, "Core Focus: Distributed Systems, Artificial Intelligence, Scalable Full-Stack Architecture", font="F1", size=9, r=0.35, g=0.4, b=0.45)
    curr_y -= 18

    # 5. ACHIEVEMENTS & CONTRIBUTIONS
    curr_y = draw_section_heading(curr_y, "Achievements & Contributions")
    achievements = [
        "Active Open Source Contributor: Maintained active repositories, multi-agent frameworks, and developer tooling.",
        "500+ Algorithmic & System Challenges solved across competitive programming platforms.",
        "Hackathon Builder: Led end-to-end MVP design and deployment under rapid 24-48 hour delivery cycles."
    ]
    for ach in achievements:
        add_text(60, curr_y, "[*]", font="F1", size=8, r=0.42, g=0.55, b=1.0)
        add_text(75, curr_y, ach, font="F1", size=9.2, r=0.2, g=0.25, b=0.3)
        curr_y -= 13

    stream_data = "\n".join(stream_cmds).encode("latin1")
    stream_len = len(stream_data)

    objects = []
    
    # obj 1: Catalog
    objects.append("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    # obj 2: Pages
    objects.append("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
    # obj 3: Page
    objects.append("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>\nendobj\n")
    # obj 4: Font F1 (Helvetica)
    objects.append("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n")
    # obj 5: Font F2 (Helvetica-Bold)
    objects.append("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n")
    # obj 6: Font F3 (Helvetica-Oblique)
    objects.append("6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>\nendobj\n")
    # obj 7: Stream
    obj7_header = f"7 0 obj\n<< /Length {stream_len} >>\nstream\n"
    obj7_footer = "\nendstream\nendobj\n"
    
    header = "%PDF-1.4\n"
    
    # Calculate xref offsets
    current_offset = len(header.encode("latin1"))
    offsets = [0]
    
    for obj_str in objects:
        offsets.append(current_offset)
        current_offset += len(obj_str.encode("latin1"))
        
    offsets.append(current_offset)
    obj7_total = obj7_header.encode("latin1") + stream_data + obj7_footer.encode("latin1")
    current_offset += len(obj7_total)
    
    xref_offset = current_offset
    xref = f"xref\n0 {len(offsets)}\n0000000000 65535 f \n"
    for off in offsets[1:]:
        xref += f"{off:010d} 00000 n \n"
        
    trailer = f"trailer\n<< /Size {len(offsets)} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n"
    
    with open(filename, "wb") as f:
        f.write(header.encode("latin1"))
        for obj_str in objects:
            f.write(obj_str.encode("latin1"))
        f.write(obj7_total)
        f.write(xref.encode("latin1"))
        f.write(trailer.encode("latin1"))

if __name__ == "__main__":
    out_file = "C:/Users/dhruv/.gemini/antigravity/scratch/portfolio-website/assets/Resume_Dhruv_Sharma.pdf"
    build_pdf(out_file)
    print("Successfully generated:", out_file)
