# Bappuji Website Blueprint

## Overview

This document outlines the architecture, features, and development plan for the Bappuji website. The website serves as a platform to showcase Bappuji's activities, announcements, and gallery, with an admin panel for content management.

## Project Outline

### Frontend

*   **Framework:** Next.js with App Router
*   **Styling:** Tailwind CSS
*   **UI Components:**
    *   Header with navigation
    *   Footer
    *   Hero section
    *   About section
    *   Mission & Vision section
    *   Activities section
    *   Gallery section
    *   Contact section
    *   Notification Bell
    *   Posts Grid

### Backend

*   **Database:** Supabase
*   **Authentication:** Supabase Auth
*   **Storage:** Supabase Storage for image uploads

### Pages & Routing

*   `/`: Home page
*   `/announcements`: Announcements page
*   `/posts`: Posts page
*   `/admin/login`: Admin login page
*   `/admin`: Admin dashboard
*   `/admin/announcements`: Admin announcements management
*   `/admin/gallery`: Admin gallery management
*   `/admin/posts`: Admin posts management

### Features

*   **Public Website:**
    *   Displays information about Bappuji.
    *   Showcases activities, gallery, and announcements.
*   **Admin Panel:**
    *   Protected by authentication.
    *   CRUD functionality for announcements, gallery, and posts.
    *   Image uploads to Supabase Storage.

## Current Task: Fix Mobile Overflow in Gallery
