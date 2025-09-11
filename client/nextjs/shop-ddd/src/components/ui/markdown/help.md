# Markdown Formatting Guide

This guide covers the official CommonMark specification for markdown formatting, with special focus on proper list formatting and common pitfalls.

## Table of Contents

1. [Headers](#headers)
2. [Text Formatting](#text-formatting)
3. [Lists](#lists)
4. [Links](#links)
5. [Images](#images)
6. [Code](#code)
7. [Tables](#tables)
8. [Blockquotes](#blockquotes)
9. [Line Breaks](#line-breaks)
10. [Common Mistakes](#common-mistakes)

## Headers

Use `#` for headers. More `#` symbols create smaller headers.

```markdown
# H1 Header
## H2 Header
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header
```

## Text Formatting

### Basic Formatting
- **Bold**: `**text**` or `__text__`
- *Italic*: `*text*` or `_text_`
- ~~Strikethrough~~: `~~text~~`
- `Inline code`: `` `text` ``

### Combined Formatting
- ***Bold and italic***: `***text***`
- **Bold with `inline code`**: `**Bold with `code`**`

## Lists

### Bullet Lists (Unordered)

Use `-`, `+`, or `*` as list markers. All three are equivalent:

```markdown
- Item 1
- Item 2
- Item 3
```

```markdown
* Item 1
* Item 2
* Item 3
```

```markdown
+ Item 1
+ Item 2
+ Item 3
```

### Numbered Lists (Ordered)

Use numbers followed by periods:

```markdown
1. First item
2. Second item
3. Third item
```

### Nested Lists

**Important**: Use **2 spaces** for proper nesting, not 4 spaces or tabs.

#### ✅ Correct Nesting (2 spaces)
```markdown
* Main item
  - Nested item
  - Another nested item
    - Deeply nested item
```

#### ❌ Incorrect Nesting (4 spaces creates code block)
```markdown
* Main item
    - This creates a code block, not a nested list
```

#### ✅ Alternative: Using Tabs
```markdown
* Main item
	- Nested item (using tab)
```

### List Item Content

For multi-line list items, align content with the first character after the marker:

```markdown
- This is a long list item that spans
  multiple lines. Notice the alignment.
  
- Another item with a code block:
  
  ```javascript
  console.log('Hello World');
  ```
  
- Item with nested content:
  
  This is a paragraph within a list item.
  
  > This is a blockquote within a list item.
```

### Mixed Lists

```markdown
1. First ordered item
2. Second ordered item
   - Unordered sub-item
   - Another sub-item
     1. Ordered sub-sub-item
     2. Another ordered sub-sub-item
3. Third ordered item
```

## Links

### Basic Links
- `[Link text](URL)`
- `[Link with title](URL "Title text")`

Examples:
```markdown
[GitHub](https://github.com)
[GitHub with title](https://github.com "Go to GitHub")
```

### Reference Links
```markdown
[Link text][reference]
[Another link][ref2]

[reference]: https://example.com
[ref2]: https://example.com "Title"
```

### Automatic Links
```markdown
<https://example.com>
<email@example.com>
```

## Images

### Basic Images
```markdown
![Alt text](image-url)
![Alt text](image-url "Title")
```

### Reference Images
```markdown
![Alt text][image-ref]

[image-ref]: image-url "Title"
```

## Code

### Inline Code
Use single backticks: `` `code` ``

### Code Blocks

#### Fenced Code Blocks (Recommended)
```markdown
```javascript
function hello() {
    console.log('Hello World');
}
```
```

#### Indented Code Blocks
Use 4 spaces or 1 tab:

```markdown
    function hello() {
        console.log('Hello World');
    }
```

### Code Block with Language Highlighting
```markdown
```python
def hello():
    print("Hello World")
```
```

## Tables

Tables require pipes `|` to separate columns:

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Table Alignment
```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| L1   |   C1   |    R1 |
| L2   |   C2   |    R2 |
```

## Blockquotes

Use `>` for blockquotes:

```markdown
> This is a blockquote.
> It can span multiple lines.

> This is another blockquote.
>
> With multiple paragraphs.
```

### Nested Blockquotes
```markdown
> This is a blockquote.
>
> > This is a nested blockquote.
>
> Back to the first level.
```

## Line Breaks

### Soft Line Break
End a line with two spaces for a soft break:
```markdown
Line one  
Line two
```

### Hard Line Break
Use a blank line for paragraph breaks:
```markdown
Paragraph one.

Paragraph two.
```

## Horizontal Rules

Use three or more dashes, asterisks, or underscores:

```markdown
---
***
___
```

## Escaping Characters

Use backslash `\` to escape special characters:

```markdown
\*This is not italic\*
\# This is not a header
\[This is not a link\]
```

## Common Mistakes

### ❌ List Indentation Errors

**Problem**: Using 4 spaces for nested lists
```markdown
* Main item
    - Creates code block instead of nested list
```

**Solution**: Use 2 spaces
```markdown
* Main item
  - Proper nested list
```

### ❌ Missing Blank Lines

**Problem**: No separation between different elements
```markdown
# Header
Paragraph immediately after header without blank line.
* List item without separation
```

**Solution**: Add blank lines
```markdown
# Header

Paragraph with proper separation.

* List item with proper separation
```

### ❌ Inconsistent List Markers

**Problem**: Mixing different markers inconsistently
```markdown
* Item 1
- Item 2  
+ Item 3
```

**Solution**: Be consistent within the same list level
```markdown
* Item 1
* Item 2
* Item 3
```

### ❌ Incorrect Table Formatting

**Problem**: Missing pipes or alignment
```markdown
Header 1 | Header 2
Cell 1 Cell 2
```

**Solution**: Proper table structure
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

## Best Practices

1. **Consistency**: Use the same markers throughout your document
2. **Spacing**: Always use blank lines to separate different elements
3. **Indentation**: Use 2 spaces for nested lists, not 4 spaces or tabs
4. **Headers**: Use descriptive headers and maintain hierarchy
5. **Links**: Use descriptive link text, avoid "click here"
6. **Code**: Always specify language for syntax highlighting
7. **Tables**: Keep tables simple and readable

## Testing Your Markdown

Use the `MarkdownTest` component to verify your formatting:

```tsx
import MarkdownTest from './components/ui/markdown/MarkdownTest';

// Test your markdown formatting
<MarkdownTest />
```

This component demonstrates the difference between correct and incorrect list formatting, helping you understand the CommonMark specification in practice.

---

*This guide follows the [CommonMark specification](https://spec.commonmark.org/), the official standard for Markdown formatting.*
