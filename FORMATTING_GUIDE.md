# Work Experience Formatting Guide

The Work Experience section now includes a rich text editor with formatting capabilities that render perfectly in the PDF output.

## Available Formatting Options

### 1. **Bold Text**
- **In Editor**: Click the **B** button or wrap text with `**text**`
- **Example**: `**Led a team of 5 developers**`
- **PDF Output**: Text appears in bold font

### 2. **Italic Text**
- **In Editor**: Click the *I* button or wrap text with `*text*`
- **Example**: `*Improved performance by 40%*`
- **PDF Output**: Text appears in italic font

### 3. **Bullet Points**
- **In Editor**: Click the bullet list button or start line with `•`, `-`, or `*`
- **Example**: 
  ```
  • Developed RESTful APIs using Node.js
  • Implemented authentication with JWT
  ```
- **PDF Output**: Properly indented bullet points

### 4. **Numbered Lists**
- **In Editor**: Click the numbered list button or start line with `1.`, `2.`, etc.
- **Example**:
  ```
  1. Analyzed requirements and created technical specifications
  2. Designed database schema and API endpoints
  3. Implemented features and wrote unit tests
  ```
- **PDF Output**: Numbered list with proper indentation

## Combining Formats

You can combine bold and italic within bullet points and numbered lists:

```
• **Architected** and implemented a *microservices-based* system
• Reduced deployment time by **50%** using *CI/CD pipelines*
1. **Phase 1**: Requirements gathering and *stakeholder interviews*
2. **Phase 2**: Design and prototyping
```

## Smart Auto-Continuation

The editor is smart and helps you work faster:

### **Enter Key Behavior**
- **Press Enter** on a bullet point → Automatically creates the next bullet point
- **Press Enter** on a numbered item → Automatically creates the next number (increments)
- **Press Enter** on an empty bullet/number → Exits list mode (removes empty item)
- **Press Shift+Enter** → Creates a simple line break without continuing the list

### **Example Workflow**
1. Click the bullet button or type `• `
2. Type your first point
3. Press **Enter** → New bullet appears automatically
4. Type your second point
5. Press **Enter** → New bullet appears
6. Press **Enter** again on empty bullet → Exits bullet mode

Same works for numbered lists (1., 2., 3., etc.)!

## Tips for Best Results

1. **Use the toolbar buttons** - They automatically insert the correct syntax
2. **Select text first** - Highlight text before clicking Bold/Italic to wrap it
3. **Mix formats freely** - Combine bullets, numbering, bold, and italic as needed
4. **Use Enter for lists** - Press Enter to continue bullets/numbering automatically
5. **Use Shift+Enter for line breaks** - When you need a new line without continuing the list
6. **Preview before download** - Always check the PDF preview to ensure formatting looks correct
7. **Keep it professional** - Don't overuse formatting; use it to highlight key achievements

## Keyboard Shortcuts

### Smart Keys
- **Enter** - Continue current bullet or numbered list (auto-increment)
- **Shift+Enter** - Simple line break without continuing list
- **Enter on empty bullet/number** - Exit list mode

### Manual Formatting
You can also type the markdown syntax directly:
- `**text**` for bold
- `*text*` for italic
- Start line with `•` or `-` for bullets
- Start line with `1.` for numbered lists

## Example Work Experience Entry

```
Senior Software Engineer
Tech Company Inc. - San Francisco, CA
Jan 2020 - Present

**Key Achievements:**
• **Led development** of a *scalable microservices architecture* serving 1M+ users
• Improved application performance by **60%** through code optimization
• *Mentored* 5 junior developers and conducted code reviews

**Technical Contributions:**
1. **Designed and implemented** RESTful APIs using Node.js and Express
2. Integrated *third-party services* including Stripe, SendGrid, and AWS S3
3. Established **CI/CD pipeline** reducing deployment time by *75%*
```

This will render beautifully in the PDF with proper formatting, alignment, and professional appearance!
