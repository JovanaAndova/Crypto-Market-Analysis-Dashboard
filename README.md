**Crypto Market Analysis Dashboard**

A full-stack financial technology web application designed to track cryptocurrency assets, process historical market candles, and display analytical buy/sell/hold trading indicators.

**Tech Stack**
**Backend**: Java (Spring Boot), Spring Data JPA, H2 Database (File-based), Apache Commons CSV.

**Frontend**: React, React Router, Recharts (Data Visualizations), Pure CSS Layout.

**Architecture**: Decoupled REST API + Single Page Application (SPA), Layered Architecture (Controller, Service, Repository, Entity), Full CORS Integration.

**Documentation**: Contains the project architectural PDF and the operational demo video.

**Key Features**
Real-time Asset Monitoring: Tracks coin symbols, market cap ranks, and dynamic spot values.

Granular Market Analytics: Renders interactive historical OHLCV charting structures (up to 500 candles).

Technical Analysis Engine: Displays calculated indicators (BUY, SELL, HOLD) with strength scores for 1D, 1W, and 1M intervals.

Auto-Ingestion Pipeline: Automatic CSV parsing and database deduplication/population on startup.

**Project Structure**
backend — Spring Boot application source code and Maven configurations.
frontend — React user interface codebase.
documentation — System architecture PDF and operational demo video (`DAS4.mp4`).
tech_analysis.py — Independent Python data utility script.

**How to Run**
1. Start the Backend
DOS
./mvnw spring-boot:run
Runs on http://localhost:8080

H2 Database Console available at http://localhost:8080/h2 (JDBC URL: jdbc:h2:file:./data/demo-db)

2. Start the Frontend
DOS
npm install
npm start
Runs on http://localhost:3000
