# Frontend Application

This is a React frontend application designed to integrate with an existing Spring Boot backend. The application is structured to provide a clean separation of components, pages, and services for better maintainability and scalability.

## Project Structure

- **src/**: Contains the source code for the application.
  - **components/**: Contains reusable components.
    - **App.tsx**: The main application component that sets up routing and includes other components.
  - **pages/**: Contains the different pages of the application.
    - **Home.tsx**: The homepage component.
  - **services/**: Contains functions for making API calls to the Spring Boot backend.
    - **api.ts**: Functions like `fetchData` and `postData` for interacting with backend endpoints.
  - **index.tsx**: The entry point of the React application that renders the App component.

- **public/**: Contains static files.
  - **index.html**: The main HTML file that serves the React application.

- **tsconfig.json**: TypeScript configuration file specifying compiler options and files to include.

- **package.json**: npm configuration file listing dependencies, scripts, and metadata for the project.

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd frontend-app
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

The application will be available at `http://localhost:3000`.

## API Integration

This application communicates with the Spring Boot backend. Ensure that the backend is running and accessible for the frontend to function correctly. Adjust the API endpoints in `src/services/api.ts` as necessary to match your backend configuration.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.