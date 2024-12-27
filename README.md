# Ballwatch

![Author](https://img.shields.io/badge/Kewin33-red)
![npm](https://img.shields.io/badge/npm-9.8.1-blue)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

## Project Description
This project is a web application that compares streaming services for soccer games based on user preferences.

## Table of Contents

1. [Usage](#Usage)
2. [Features](#features)
3. [Development Approach](#development-approach)
4. [System Design](#system-design)
5. [Future Improvements](#future-improvements)
6. [License](#license)

## Usage
___
### Web App
The Web App is hosted on Vercel. You can find the usage on the [help page](#https://gen-dev2024.vercel.app/help). </br>
Click [here](#https://gen-dev2024.vercel.app/) to try out the Comparison Page.

### Video
A video where I host the Webapp locally. It's a little bit faster than on vercel(takes about 0-5sec/req):
https://www.loom.com/share/5651154a5ca548a59f3ef846e964c39f?sid=29acd38b-89b7-4f7e-9786-02565e7f9b77

## Features
___
### Basic Features
- **Team Selection**: Users can select one or multiple teams to compare streaming packages.
- **Streaming Package Ranking**: The app ranks streaming packages based on the availability of matches.
- **Optimal Price Combination**: When a single package doesn't cover all matches, the app suggests the most affordable combination of packages.
- **Efficient Search**: The search process is optimized to ensure reasonable response times without affecting user experience.

### Advanced Features
- **Search Filters**: Includes filters such as date range, tournament, streaming preferences, and live/highlight options.
- **User Search History**: Stores user search history locally in the browser, with a limit of the last 5 searches.

## Development Approach
___
- **Code Quality**:
  I made sure to write clean, maintainable code throughout the project. Each function and module in the backend is properly commented, with clear explanations of parameters and return values. On the frontend, I broke everything down into smaller components, making the whole app easier to manage. Each file is kept to a reasonable size, keeping things neat and readable.
- **Efficiency**:
  The problem is based on the [Weighted Set Cover Problem](#https://en.wikipedia.org/wiki/Set_cover_problem#Weighted_set_cover). To solve it efficiently, I used a mix of greedy algorithms and a precise recursive approach. This helps minimize the size of the set and guarantees quick, accurate results. The WebApp is way slower though due to a slow but free database(takes about 0-30sec/req).
- **User Interface**:
  The UI is designed with a lot of care. I’ve made sure everything is intuitive and easy to use, with fast and accurate search results. I wanted users to have a smooth experience without unnecessary complexity.
- **Innovation**:
  Besides the basic features, I added a few extra touches to make the app more functional and engaging. Features like the filter options, search history, and links to streaming services make it stand out a bit more.
- **Documentation**:
  The code is well-commented and easy to follow. Plus, there’s a helpful page with clear instructions on how to use everything. You’ll find everything you need to get up and running.

## System Design
___
### Tech Stack
- **Next.js**: React framework for building the web application.
- **Prisma ORM**: Object-relational mapping tool to interact with MySQL database.
- **NeonDb**: Relational database management system for storing data. (I firstly used Mysql for local testing)
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
- **React**: JavaScript library for building user interfaces.
- **Vercel**: Host of the web app.


### Architecture
The application is divided into several components that interact with each other:

1. **Frontend (React + Next.js)**: Displays the user interface, including filters and the streaming comparison.
2. **Backend (Next.js)**: Handles API requests, processes data, and interacts with the Prisma ORM to retrieve and calculates with the data from the database.
3. **Database (NeonDb + Prisma ORM)**: Stores all relevant data for teams, tournaments, streaming services, and search history.

### Database Schema
Containing these given tables:
- **Games**: Events where two teams compete, scheduled on specific dates within a tournament.
- **Streaming Packages**: Subscription services from providers like Magenta, Sky, etc., offering live or on-demand access to games with monthly or yearly pricing options. These packages are listed in the result overview.
- **Streaming Offers**: These offers specify the availability of a game within a streaming package, detailing whether it's available live or as on-demand highlights. Both options are included in the comparison results.

The Prisma schema is defined in the [`schema.prisma`](./prisma/schema.prisma) file.


## Future Improvements
___
There's always room for improvement, and here are some features I couldn't implement in time:

- **Streaming Service Icons**: Add icons for streaming services to make the comparison more visually engaging.
- **Enhanced Game Details**: Provide additional game information, such as scores, locations, or other relevant details.
- **User Authentication**: Integrate user login functionality to allow users to save their preferences and search history across sessions, offering a more personalized experience.
- **Optimized Set Cover Algorithm**: Improve the efficiency of the set cover algorithm for faster results or potentially explore the use of a faster database ;).


## License
___
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details :)
