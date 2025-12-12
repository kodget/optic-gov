# Optic-Gov

A blockchain-based government transparency platform that enables real-time tracking of public projects, contractor accountability, and citizen oversight.

## Features

### 🏛️ Government Transparency
- **Interactive Project Map**: Real-time visualization of all public projects
- **Milestone Tracking**: Detailed progress monitoring with evidence verification
- **Budget Transparency**: Public access to project budgets and spending
- **AI-Powered Analysis**: Automated milestone verification and risk assessment

### 👥 Multi-Role System
- **Governors**: Create projects, generate milestones, monitor progress
- **Contractors**: Submit evidence, upload videos, track assignments
- **Citizens**: View project status, access transparency data

### 🔐 Authentication & Security
- Role-based access control
- Secure API integration
- Real-time data synchronization

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Leaflet** for interactive maps
- **Lucide React** for icons

### Backend Integration
- **REST API** with 7 endpoints
- **Authentication** system
- **File upload** capabilities
- **Health monitoring**

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/kodget/optic-gov.git
cd optic-gov/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create `.env` file in frontend directory:
```env
VITE_API_BASE_URL=https://optic-gov.onrender.com
```

## Testing Flow

### 1. Public Access
- Visit `http://localhost:5173/`
- Explore **Transparency Map** (public projects view)
- Click projects to view details

### 2. Authentication
**Registration:**
- Click "Register" → Fill form → Select user type (Governor/Contractor)
- Tests `/register` endpoint

**Login:**
- Click "Login" → Enter credentials → Select user type
- Tests `/login` endpoint

### 3. Governor Workflow
- **Dashboard**: `/governor-dashboard` - View projects and stats
- **Create Project**: `/create-project` - Add new public projects
- **Generate Milestones**: `/generate-milestones` - AI-powered milestone creation

### 4. Contractor Workflow
- **Portal**: `/contractor-portal` - View assigned projects
- **Submit Evidence**: Upload videos/files for milestone verification
- Tests `/verify-milestone` endpoint

### 5. System Monitoring
- **Health Check**: `/health` - API status monitoring
- Tests `/health` endpoint

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/register` | POST | User registration |
| `/login` | POST | User authentication |
| `/create-project` | POST | Create new project |
| `/generate-milestones` | POST | AI milestone generation |
| `/verify-milestone` | POST | Evidence submission |
| `/health` | GET | System health check |
| `/projects` | GET | Public project data |

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── pages/        # Page components
│   │   └── forms/        # Form components
│   ├── services/
│   │   └── api.ts        # API client
│   ├── types/            # TypeScript definitions
│   └── App.tsx           # Main application
├── public/               # Static assets
└── package.json          # Dependencies
```

## Key Components

- **TransparencyMapPage**: Interactive project visualization
- **GovernorDashboard**: Project management interface
- **ContractorPortal**: Evidence submission system
- **ProjectDetails**: Public project information
- **MilestoneSubmission**: Video upload and verification

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details