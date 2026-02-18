# Resume Builder

A modern, professional resume builder application with PDF export functionality. Built with React, TailwindCSS, and jsPDF.

## Features

- **One-Click Sample Data**: Fill all fields instantly with professional example data for quick testing
- **12 Color Themes**: Choose from 12 professional color schemes for your resume (Blue, Indigo, Purple, Green, Teal, Red, Orange, Pink, Slate, Gray, Cyan, Navy)
- **Custom Sections**: Add unlimited custom sections (Certifications, Awards, Publications, Languages, Volunteer Work, etc.)
- **Dynamic Form Fields**: Add/remove education, work experience, skills, projects, and custom sections as needed
- **Smart Rich Text Editor**: 
  - Bold, italic, bullet points, and numbered lists in work experience, projects, AND custom sections
  - Press **Enter** to auto-continue bullets/numbering
  - Press **Shift+Enter** for simple line breaks
  - Auto-increment numbered lists
- **Professional PDF Generation**: Creates well-formatted, ATS-friendly PDF resumes
- **Live Preview**: Preview your resume before downloading
- **Modern UI**: Clean, responsive design with TailwindCSS
- **Proper Formatting**: Sections are properly aligned with consistent spacing

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will open automatically in your browser at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## How to Use

### Quick Start (Recommended)
1. **Click "Fill Sample Data"**: Instantly populate all fields with professional example data
2. **Select Color Theme**: Choose from 12 professional colors for your resume
3. **Review and Edit**: Modify the sample data to match your information
4. **Preview**: Click "Preview PDF" to see your resume
5. **Download**: Click "Download PDF" to save

### Manual Entry
1. **Select Color Theme**: Choose your preferred color (Blue, Purple, Green, etc.)
2. **Fill in Personal Information**: Enter your name, contact details, and professional summary
3. **Add Education**: Click "Add Education" to add multiple degrees/certifications
4. **Add Work Experience**: Click "Add Experience" to add your job history
   - Use the formatting toolbar for **bold**, *italic*, bullets, and numbering
5. **Add Skills**: Organize skills by category (e.g., Programming Languages, Tools, etc.)
6. **Add Projects**: Showcase your projects with descriptions and technologies used
   - Use the formatting toolbar for **bold**, *italic*, bullets, and numbering
7. **Add Custom Sections**: Click "Add Custom Section" to add sections like:
   - Certifications
   - Awards & Recognition
   - Publications
   - Languages
   - Volunteer Work
   - Professional Memberships
   - Or any other section you need!
8. **Preview**: Click "Preview PDF" to see how your resume looks
9. **Download**: Click "Download PDF" to save your resume

## Tips for Best Results

- **Choose the right color**: Select a color theme that matches your industry (e.g., Blue/Navy for corporate, Purple/Teal for creative)
- **Use custom sections strategically**: Add sections that showcase your unique qualifications (Certifications, Awards, Publications)
- Use bullet points in work experience, projects, and custom sections for better readability
- Use **bold** for emphasis on key achievements and *italic* for technologies
- Keep descriptions concise and achievement-focused
- Fill in all relevant fields for a complete resume
- Use consistent date formats (e.g., "Jan 2020 - Dec 2022")
- Add specific technologies and skills to stand out
- Order custom sections by relevance to the job you're applying for

## Tech Stack

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **TailwindCSS**: Styling
- **jsPDF**: PDF generation
- **Lucide React**: Icons

## License

MIT
