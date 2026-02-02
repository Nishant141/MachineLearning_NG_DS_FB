# Regression Analysis Suite

This is a web-based application built with Next.js that allows users to perform simple linear regression analysis on their own data. It provides a user-friendly interface to input data, visualize the relationship between variables, and evaluate the performance of the regression model.

A key feature of this application is the **AI Assumption Checker**, which leverages a generative AI model through Genkit to analyze the underlying assumptions of linear regression (linearity and multicollinearity) and suggests data transformations to address potential violations.

## Features

- **CSV Data Input**: Easily paste your data in CSV (Comma-Separated Values) format.
- **Variable Selection**: Choose your independent (X) and dependent (Y) variables from the parsed data.
- **Simple Linear Regression**: Automatically calculates the best-fit regression line for your data.
- **Key Performance Metrics**: Instantly view essential metrics to evaluate your model, including:
  - R² Score
  - Mean Absolute Error (MAE)
  - Mean Squared Error (MSE)
  - Root Mean Squared Error (RMSE)
- **Interactive Visualization**: A scatter plot visualizes your data points along with the fitted regression line, provided by Recharts.
- **AI-Powered Assumption Checking**: Use the integrated AI tool to:
  - Analyze the linearity assumption.
  - Check for multicollinearity using Variance Inflation Factor (VIF) concepts.
  - Receive suggestions for data transformations to improve model accuracy.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit)
- **Charting**: [Recharts](https://recharts.org/)

## How to Use

1.  **Input Data**: Open the application and paste your dataset in CSV format into the "CSV Data" text area. The first row should contain the headers.
2.  **Parse Data**: Click the "Parse CSV Data" button. The application will process your data and identify the columns.
3.  **Select Variables**: Choose the desired **Independent Variable (X)** and **Dependent Variable (Y)** from the dropdown menus.
4.  **Run Analysis**: Click the "Run Analysis" button to perform the linear regression.
5.  **View Results**: The results will be displayed, including the key metrics and the regression chart.
6.  **Check Assumptions**: In the "AI Assumption Checker" card, describe your analysis goal and click "Check Assumptions". The AI will provide an analysis of the regression assumptions and suggest improvements.

## Getting Started with Local Development

To run this project locally, you will need to have Node.js and npm installed.

1.  **Clone the Repository**:
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a file named `.env` in the root of your project and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.
