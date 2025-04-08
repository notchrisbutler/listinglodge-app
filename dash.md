# Dashboard UI Scaffold Structure

## Overview

The dashboard application will be hosted on a subdomain (e.g., `app.listinglodge.com`) and is intended for authenticated users to manage property listings. The goal is to maintain visual consistency with the main marketing site while adapting the UI for a more data-dense and interactive environment.

## Styling Guidelines

- **Theme Source:** Replicate the theme from the marketing site's `globals.css`.
- **CSS Variables:** Use the exact HSL values for color variables for both light and dark modes.
- **Border Radius:** Base radius is `0.5rem`.
- **Fonts:** Use Tailwind's default `font-sans` stack.

## Core Features and Tools

The dashboard will include the following tools and features, inspired by the existing `Features.tsx` content:

1. **AI-Powered Listing Descriptions**
   - **Page/Tool:** A dedicated page or tool for generating SEO-optimized property descriptions using AI. Users can input property details and receive engaging descriptions tailored to their target audience.

2. **Social Media Content Generator**
   - **Page/Tool:** A tool for creating platform-specific social media posts. Users can generate content for Facebook, Instagram, Twitter, and LinkedIn to effectively showcase their listings.

3. **Visual Content Enhancement**
   - **Page/Tool:** A feature for enhancing property photos. This includes adding professional captions, virtual staging suggestions, and optimizing images for better presentation.

4. **Performance Analytics**
   - **Page/Tool:** An analytics dashboard to track engagement metrics across platforms. This tool helps users optimize their marketing strategies by providing insights into content performance.

5. **Time-Saving Automation**
   - **Page/Tool:** A scheduling and automation tool for content creation and distribution. This feature saves users time by automating repetitive tasks and managing content workflows.

6. **Target Audience Customization**
   - **Page/Tool:** A customization tool that allows users to tailor content to specific buyer demographics, neighborhoods, and property types for maximum impact. 