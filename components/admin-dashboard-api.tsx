'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Replace this with your actual API Gateway invoke URL
const API_GATEWAY_URL = 'https://k3aeqzs4bk.execute-api.us-east-1.amazonaws.com/Prod'

// Define types for our data structures
type LoginData = {
  user_id: string;
  password: string;
}

type PatientData = {
  first_name: string;
  last_name: string;
  dob: string;
  phone: string;
  weight: string;
  sugar_level: string;
  blood_level: string;
  prescription: string;
}

type SearchData = {
  first_name: string;
  last_name: string;
}

type RecentJob = {
  id: number;
  patient: string;
  action: string;
  date: string;
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeView, setActiveView] = useState('login')
  const [loginData, setLoginData] = useState<LoginData>({ user_id: '', password: '' })
  const [patientData, setPatientData] = useState<PatientData>({
    first_name: '', last_name: '', dob: '', phone: '',
    weight: '', sugar_level: '', blood_level: '', prescription: ''
  })
  const [searchData, setSearchData] = useState<SearchData>({ first_name: '', last_name: '' })
  const [searchResult, setSearchResult] = useState<PatientData | null>(null)
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([])

  useEffect(() => {
    // Fetch recent jobs when component mounts
    fetchRecentJobs()
  }, [])

  const fetchRecentJobs = async () => {
    // This is a placeholder. In a real app, you'd fetch this data from your backend
    setRecentJobs([
      { id: 1, patient: 'John Doe', action: 'Registration', date: '2024-10-21' },
      { id: 2, patient: 'Jane Smith', action: 'Update', date: '2024-10-20' },
    ])
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_GATEWAY_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      console.log('Login response:', data)
      if (response.ok) {
        setIsLoggedIn(true)
        setActiveView('dashboard')
      } else {
        alert('Login failed: ' + data.message)
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('An error occurred during login')
    }
  }

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_GATEWAY_URL}/register_patient`, {
        method: 'POST',
        body: JSON.stringify(patientData),
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      if (response.ok) {
        alert('Patient registered successfully')
        setPatientData({
          first_name: '', last_name: '', dob: '', phone: '',
          weight: '', sugar_level: '', blood_level: '', prescription: ''
        })
        fetchRecentJobs() // Refresh recent jobs list
      } else {
        alert('Registration failed: ' + data.message)
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('An error occurred during patient registration')
    }
  }

  const handleSearchPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_GATEWAY_URL}/search_patient?first_name=${searchData.first_name}&last_name=${searchData.last_name}`)
      const data = await response.json()
      if (response.ok) {
        setSearchResult(data)
        setActiveView('patientDetails')
      } else {
        alert('Search failed: ' + data.error)
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('An error occurred during patient search')
    }
  }

  const handleUpdatePatient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchResult) return
    try {
      const response = await fetch(`${API_GATEWAY_URL}/update_patient`, {
        method: 'POST',
        body: JSON.stringify(searchResult),
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      if (response.ok) {
        alert('Patient updated successfully')
        setActiveView('dashboard')
        fetchRecentJobs() // Refresh recent jobs list
      } else {
        alert('Update failed: ' + data.message)
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('An error occurred during patient update')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="text"
                placeholder="User ID"
                value={loginData.user_id}
                onChange={(e) => setLoginData({ ...loginData, user_id: e.target.value })}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Genesis Global Medical Department</h1>
      <div className="flex space-x-4 mb-8">
        <Button onClick={() => setActiveView('dashboard')}>Dashboard</Button>
        <Button onClick={() => setActiveView('register')}>Register Patient</Button>
        <Button onClick={() => setActiveView('search')}>Search Patient</Button>
        <Button onClick={() => setIsLoggedIn(false)}>Logout</Button>
      </div>

      {activeView === 'dashboard' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.patient}</TableCell>
                    <TableCell>{job.action}</TableCell>
                    <TableCell>{job.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeView === 'register' && (
        <Card>
          <CardHeader>
            <CardTitle>Register New Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegisterPatient} className="space-y-4">
              <Input
                placeholder="First Name"
                value={patientData.first_name}
                onChange={(e) => setPatientData({ ...patientData, first_name: e.target.value })}
                required
              />
              <Input
                placeholder="Last Name"
                value={patientData.last_name}
                onChange={(e) => setPatientData({ ...patientData, last_name: e.target.value })}
                required
              />
              <Input
                type="date"
                placeholder="Date of Birth"
                value={patientData.dob}
                onChange={(e) => setPatientData({ ...patientData, dob: e.target.value })}
                required
              />
              <Input
                placeholder="Phone Number"
                value={patientData.phone}
                onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                required
              />
              <Input
                placeholder="Weight"
                value={patientData.weight}
                onChange={(e) => setPatientData({ ...patientData, weight: e.target.value })}
              />
              <Input
                placeholder="Sugar Level"
                value={patientData.sugar_level}
                onChange={(e) => setPatientData({ ...patientData, sugar_level: e.target.value })}
              />
              <Input
                placeholder="Blood Level"
                value={patientData.blood_level}
                onChange={(e) => setPatientData({ ...patientData, blood_level: e.target.value })}
              />
              <Input
                placeholder="Prescription"
                value={patientData.prescription}
                onChange={(e) => setPatientData({ ...patientData, prescription: e.target.value })}
              />
              <Button type="submit">Register Patient</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeView === 'search' && (
        <Card>
          <CardHeader>
            <CardTitle>Search Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearchPatient} className="space-y-4">
              <Input
                placeholder="First Name"
                value={searchData.first_name}
                onChange={(e) => setSearchData({ ...searchData, first_name: e.target.value })}
                required
              />
              <Input
                placeholder="Last Name"
                value={searchData.last_name}
                onChange={(e) => setSearchData({ ...searchData, last_name: e.target.value })}
                required
              />
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeView === 'patientDetails' && searchResult && (
        <Card>
          <CardHeader>
            <CardTitle>Patient Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePatient} className="space-y-4">
              <Input
                placeholder="First Name"
                value={searchResult.first_name}
                onChange={(e) => setSearchResult({ ...searchResult, first_name: e.target.value })}
                disabled
              />
              <Input
                placeholder="Last Name"
                value={searchResult.last_name}
                onChange={(e) => setSearchResult({ ...searchResult, last_name: e.target.value })}
                disabled
              />
              <Input
                placeholder="Date of Birth"
                value={searchResult.dob}
                onChange={(e) => setSearchResult({ ...searchResult, dob: e.target.value })}
                disabled
              />
              <Input
                placeholder="Phone Number"
                value={searchResult.phone}
                onChange={(e) => setSearchResult({ ...searchResult, phone: e.target.value })}
                disabled
              />
              <Input
                placeholder="Weight"
                value={searchResult.weight}
                onChange={(e) => setSearchResult({ ...searchResult, weight: e.target.value })}
              />
              <Input
                placeholder="Sugar Level"
                value={searchResult.sugar_level}
                onChange={(e) => setSearchResult({ ...searchResult, sugar_level: e.target.value })}
              />
              <Input
                placeholder="Blood Level"
                value={searchResult.blood_level}
                onChange={(e) => setSearchResult({ ...searchResult, blood_level: e.target.value })}
              />
              <Input
                placeholder="Prescription"
                value={searchResult.prescription}
                onChange={(e) => setSearchResult({ ...searchResult, prescription: e.target.value })}
              />
              <Button type="submit">Update Patient</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}