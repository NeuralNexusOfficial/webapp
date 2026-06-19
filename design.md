# Design Guide: Translating Our Web Aesthetic to PPT

Hey Smriti! 

Here is the complete design breakdown from our website. I’ve put this guide together so you can easily bring the exact same sleek, premium, dark-mode tech aesthetic into your new and existing PowerPoint presentations. 

Everything below is designed to be super easy to translate directly into PowerPoint (no coding jargon, just step-by-step instructions!). You can simply copy-paste the color hex codes directly into PPT's color picker.

---

## 1. Core Presentation Color Palette (High-Contrast Dark Mode)

On projectors and large screens, extremely dark grays (like `#0A0A0A`) blend completely into pure black, making cards invisible. Similarly, dark gray text becomes impossible to read. 

Here is our **presentation-optimized** palette. These colors maintain the premium dark tech aesthetic while ensuring 100% legibility on any screen:

| Role | Color Name | Hex Code | How to Use in PPT |
| :--- | :--- | :--- | :--- |
| **Main Canvas** | Pure Black | `#000000` | **Slide Background**: Always use this as your solid slide background. |
| **Containers** | Tech Slate Gray | `#18181C` | **Content Cards & Boxes**: Lighter than website cards so they actually stand out against the pure black background. |
| **Alt Containers**| Medium Tech Slate | `#232329` | **Alternate Boxes**: Use for highlighted cards or to separate sections within a slide. |
| **Primary Text** | Pure White | `#FFFFFF` | **Headings & Main Titles**: Maximum visibility. |
| **Muted Text** | High-Contrast Gray | `#E5E7EB` | **Body Text & Bullet Points**: Highly readable on dark backgrounds (previously `#888888`, which was too dark). |
| **Subtle Text** | Slate Gray | `#9CA3AF` | **Captions, Labels & Footnotes**: Clearly legible but secondary (previously `#555555`, which was invisible). |

---

## 2. The Hackathon Track Accent Colors (Matches Website Theme)

To make the presentation feel alive and fully match the **AOT Hackathon** theme, you can use the official domain accent colors. Use these for card borders, glow effects, charts, metric highlights, or text focus words!

| Domain / Track | Accent Color Name | Hex Code | Brand Vibe & Usage in PPT |
| :--- | :--- | :--- | :--- |
| **SaaS** | Cyber Sky | `#38BDF8` | **Vibrant Sky Blue**: Perfect for technical details, cloud architectures, or metrics. |
| **AI** | Radical Rose | `#FB7185` | **Rose Pink**: Sleek future-tech vibe. Use for AI capabilities, intelligence, or key highlights. |
| **Gaming** | Electric Violet | `#A78BFA` | **Lavender Purple**: Creative and playful. Use for interactive elements or game dev tracks. |
| **Storytelling** | Neon Emerald | `#34D399` | **Emerald Green**: Highly visible. Great for user impacts, success metrics, or growth stats. |
| **Animation** | Sunset Amber | `#FBBF24` | **Warm Amber Gold**: Cinematic look. Great for design-focused slides, motion notes, or callouts. |

---

## 3. Text Gradients (The "Pro" Touch)
On the web, we use a premium, metallic-looking text gradient for major headings. You can recreate this easily in PowerPoint:

1. Select your title text.
2. Right-click and choose **Format Text Effects**.
3. Under **Text Fill**, select **Gradient Fill**.
4. Set the angle to **135°** (diagonal top-left to bottom-right).
5. Choose one of these gradient stop recipes:
   * **Classic Silver (Brand Default)**: 
     - **Stop 1 (Left)**: Pure White (`#FFFFFF`)
     - **Stop 2 (Right)**: Slate Gray (`#9CA3AF`)
   * **SaaS/Cloud Vibe**: 
     - **Stop 1 (Left)**: Pure White (`#FFFFFF`)
     - **Stop 2 (Right)**: Cyber Sky (`#38BDF8`)
   * **AI Vibe**: 
     - **Stop 1 (Left)**: Pure White (`#FFFFFF`)
     - **Stop 2 (Right)**: Radical Rose (`#FB7185`)
   * **Gaming Vibe**: 
     - **Stop 1 (Left)**: Pure White (`#FFFFFF`)
     - **Stop 2 (Right)**: Electric Violet (`#A78BFA`)

*These make your main presentation titles look incredibly polished, glossy, and thematic!*

---

## 4. Creating Our "Cyber Cards" in PowerPoint
To group text or show key metrics, we use rounded rectangle cards that look like they are floating. Here’s how to make them in PPT so they stand out beautifully:

1. Draw a **Rounded Rectangle** shape.
2. **Fill**: Set to **Tech Slate Gray** (`#18181C`) or **Medium Tech Slate** (`#232329`). *Do not use solid black, otherwise the card will be invisible!*
3. **Border/Outline**:
   - For a clean look: Set the outline color to **Pure White** (`#FFFFFF`) and set **Transparency** to **80%** (so it's subtle but visible, 92% is too faint on projectors).
   - For a themed look: Set the outline to one of our **Track Accent Colors** (e.g., Cyber Sky `#38BDF8` or Electric Violet `#A78BFA`) and set **Transparency** to **75%**.
   - Set the line width to **1 pt** or **1.25 pt**.
4. **Subtle Neon Glow**:
   - Right-click the shape -> **Format Shape** -> **Effects** (the pentagon icon) -> **Glow**.
   - Set the Glow color to a matching **Track Accent Color** (e.g., Cyber Sky `#38BDF8` or Electric Violet `#A78BFA`).
   - Set the size to **15pt - 25pt** and pull the **Transparency** to **85% - 90%** (this makes the cards look like they are floating over a modern glowing grid).

---

## 5. Typography & Fonts
To maintain a tech-forward look, we use clean, modern, geometric typefaces. 

* **For Headings & Display Titles**: **Space Grotesk** (If you don't have it, you can download it for free from Google Fonts. Alternative standard system fonts: *Century Gothic* or *Trebuchet MS* in bold).
* **For Body Text**: **Inter** (Also free on Google Fonts. Alternative standard system fonts: *Arial* or *Calibri*).

---

## 6. Buttons & Call-to-Actions (CTAs)
When you want to emphasize a key takeaway, next step, or register button, use our signature pill shape:

### Primary CTA (High Contrast)
* **Shape**: Rounded Rectangle with fully rounded corners (a pill shape).
* **Fill**: Solid White (`#FFFFFF`) OR any of the solid **Track Accent Colors** (e.g., solid Electric Violet `#A78BFA`).
* **Text**: Pure Black (`#000000`), bold, centered.
* **Border**: None.

### Secondary CTA (Subtle Outline)
* **Shape**: Pill shape.
* **Fill**: No Fill (Transparent).
* **Text**: Pure White (`#FFFFFF`) or a matching **Track Accent Color** (e.g., `#38BDF8`).
* **Border**: Solid matching color (White or Accent) with **60% transparency** (slightly more visible than before).

---

## 7. Background Visuals & Textures
To break up solid black slides and add depth, you can draw or insert these decorative elements:

### Faint Ambient Orbs (Soft Glows - Hackathon Theme Edition)
Our website has drifting, semi-transparent colored orbs that reflect the hackathon track themes. In PPT:
1. Draw a large **Oval/Circle** (e.g., covering 1/3 of the slide).
2. Go to **Format Shape** -> **Fill** -> **Gradient Fill** -> Select **Radial**.
3. Set the center stop to one of our **Track Accent Colors** (e.g., Electric Violet `#A78BFA` or Cyber Sky `#38BDF8`) with **90% transparency** (only 10% visible).
4. Set the outer stop to the same color with **100% transparency** (completely invisible).
5. Remove the outline.
6. Send it to the back (behind all text and cards) and place it in a corner. This creates a beautiful, atmospheric ambient glow that matches the site's design!

### Thin Floating Paths
We use thin, flowing waves that look like digital architecture. 
* Use PPT's **Curve** drawing tool to draw soft, winding lines across the background.
* Style the lines: **Pure White** (`#FFFFFF`) or a **Track Accent Color** (e.g., `#38BDF8`), very thin (**0.5 pt** or **0.75 pt** weight), and **80% to 90% transparent**.

---

## 8. Slide Transitions & Animations
To capture the smooth, fluid feel of the website:

* **Slide Transitions**: Use the **Morph** transition! It is your best friend. If you duplicate a slide, move a card or bullet point, and apply Morph, PPT will smoothly slide them into place, matching our website's premium feel.
* **Element Animations**: Keep it simple. Avoid "Fly In", "Bounce", or "Zoom" as they can look a bit busy. Stick to a clean, elegant **Fade** (Duration set to **0.50 seconds** or slightly slower at **0.75 seconds**) for things appearing on click.

Let me know if you want to sit down and build a couple of starter slides together to lock these in! 

Cheers,
Kishu.