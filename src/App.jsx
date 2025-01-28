
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './components/login/login'
import EmployeeDashboard from './components/dashboards/employee/dashboard'
import ManagerDashboard from './components/dashboards/manager/dashboard'
import AdminDashboard from './components/dashboards/admin/dashboard'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/employee-dashboard' element={<EmployeeDashboard />} />
          <Route path='/manager-dashboard' element={<ManagerDashboard />} />
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
