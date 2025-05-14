import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import Layout from "../components/Layout";
import axios from "axios";
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import CreateBG from "../images/CreateBG.png";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#1F2937',
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: '#F59E0B',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#F59E0B',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#E5E7EB',
  },
  chartContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

// PDF Document Component
const MyDocument = ({ userData, postData, progressData, skillExchangeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Skill Sharing Platform - Activity Report</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Profile</Text>
        <Text style={styles.text}>Name: {userData?.name}</Text>
        <Text style={styles.text}>Email: {userData?.email}</Text>
        <Text style={styles.text}>Followers: {userData?.followersCount || 0}</Text>
        <Text style={styles.text}>Following: {userData?.followingCount || 0}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Post Activity</Text>
        <Text style={styles.text}>Total Posts: {postData?.length || 0}</Text>
        <Text style={styles.text}>Average Likes per Post: {postData?.reduce((acc, post) => acc + (post.likeCount || 0), 0) / (postData?.length || 1)}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skill Progress</Text>
        <Text style={styles.text}>Total Progress Entries: {progressData?.length || 0}</Text>
        <Text style={styles.text}>Average Completion: {progressData?.reduce((acc, progress) => acc + (progress.completionPercentage || 0), 0) / (progressData?.length || 1)}%</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skill Exchange</Text>
        <Text style={styles.text}>Total Exchanges: {skillExchangeData?.length || 0}</Text>
        <Text style={styles.text}>Skills Offered: {[...new Set(skillExchangeData?.map(item => item.skillOffered))].join(', ')}</Text>
      </View>
      
      <Text style={styles.footer}>Generated on {new Date().toLocaleDateString()} - Skill Sharing Platform</Text>
    </Page>
  </Document>
);

const COLORS = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'];

const AnalyzePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [skillExchangeData, setSkillExchangeData] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Fetch user posts
          const postsRes = await axios.get(`http://localhost:8080/posts/user/${parsedUser.id}`);
          setPostData(postsRes.data);
          
          // Fetch user progress
          const progressRes = await axios.get(`http://localhost:8080/progress`);
          const userProgress = progressRes.data.filter(p => p.userId === parsedUser.id);
          setProgressData(userProgress);
          
          // Fetch user skill exchanges
          const exchangeRes = await axios.get(`http://localhost:8080/skillExchange`);
          const userExchanges = exchangeRes.data.filter(e => e.userId === parsedUser.id);
          setSkillExchangeData(userExchanges);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDownloadPDF = async () => {
    const input = document.getElementById('analytics-content');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${user?.name}_skill_analytics.pdf`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to view analytics</h2>
            <a href="/login" className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md">
              Login
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  // Prepare chart data
  const postChartData = [
    { name: 'Posts', value: postData.length },
    { name: 'Likes', value: postData.reduce((acc, post) => acc + (post.likeCount || 0), 0) },
    { name: 'Comments', value: postData.reduce((acc, post) => acc + (post.comments?.length || 0), 0) },
  ];

  const progressChartData = progressData.map(progress => ({
    name: progress.milestone,
    progress: progress.completionPercentage,
  }));

  const skillExchangeDataByType = [
    { name: 'Offered', value: skillExchangeData.length },
    { name: 'Requested', value: skillExchangeData.length },
  ];

  const activityByMonth = () => {
    const months = Array(12).fill(0).map((_, i) => {
      const date = new Date();
      date.setMonth(i);
      return date.toLocaleString('default', { month: 'short' });
    });

    const postCounts = Array(12).fill(0);
    postData.forEach(post => {
      const date = new Date(post.date);
      postCounts[date.getMonth()]++;
    });

    return months.map((month, i) => ({
      name: month,
      posts: postCounts[i],
    }));
  };

  return (
    <Layout>
      <div 
        className="min-h-screen p-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${CreateBG})` }}
      >
        <div className="max-w-6xl mx-auto" id="analytics-content">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-yellow-500">Your Skill Analytics</h1>
              <button
                onClick={handleDownloadPDF}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Report
              </button>
            </div>

            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-4 py-2 rounded-md ${activeTab === 'posts' ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-4 py-2 rounded-md ${activeTab === 'progress' ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Progress
              </button>
              <button
                onClick={() => setActiveTab('exchange')}
                className={`px-4 py-2 rounded-md ${activeTab === 'exchange' ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Skill Exchange
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-4 py-2 rounded-md ${activeTab === 'activity' ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Activity
              </button>
            </div>

            {activeTab === 'posts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">Post Statistics</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={postChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {postChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-gray-300">
                    <p>Total Posts: {postData.length}</p>
                    <p>Total Likes: {postData.reduce((acc, post) => acc + (post.likeCount || 0), 0)}</p>
                    <p>Total Comments: {postData.reduce((acc, post) => acc + (post.comments?.length || 0), 0)}</p>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">Top Liked Posts</h3>
                  <div className="space-y-3">
                    {[...postData]
                      .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
                      .slice(0, 3)
                      .map((post, index) => (
                        <div key={post.id} className="bg-gray-600 p-3 rounded">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-yellow-300">#{index + 1} - {post.title}</h4>
                            <span className="text-gray-400">{post.likeCount || 0} likes</span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1 line-clamp-2">{post.description}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">Skill Progress</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={progressChartData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <XAxis dataKey="name" stroke="#E5E7EB" />
                        <YAxis stroke="#E5E7EB" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="progress" fill="#F59E0B" name="Completion %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-gray-300">
                    <p>Total Progress Entries: {progressData.length}</p>
                    <p>Average Completion: {(progressData.reduce((acc, progress) => acc + (progress.completionPercentage || 0), 0) / (progressData.length || 1)).toFixed(1)}%</p>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">Recent Progress</h3>
                  <div className="space-y-3">
                    {progressData.slice(0, 3).map((progress) => (
                      <div key={progress.progressId} className="bg-gray-600 p-3 rounded">
                        <h4 className="font-medium text-yellow-300">{progress.milestone}</h4>
                        <p className="text-sm text-gray-300 mt-1 line-clamp-2">{progress.description}</p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-500 rounded-full h-2.5">
                            <div 
                              className="bg-yellow-500 h-2.5 rounded-full" 
                              style={{ width: `${progress.completionPercentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-right mt-1">{progress.completionPercentage}% complete</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'exchange' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">Skill Exchange</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={skillExchangeDataByType}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {skillExchangeDataByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-gray-300">
                    <p>Total Exchanges: {skillExchangeData.length}</p>
                    <p>Skills Offered: {[...new Set(skillExchangeData.map(item => item.skillOffered))].join(', ')}</p>
                    <p>Skills Requested: {[...new Set(skillExchangeData.map(item => item.skillRequested))].join(', ')}</p>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">Recent Exchanges</h3>
                  <div className="space-y-3">
                    {skillExchangeData.slice(0, 3).map((exchange) => (
                      <div key={exchange.id} className="bg-gray-600 p-3 rounded">
                        <h4 className="font-medium text-yellow-300">Exchange on {exchange.exchangeDate}</h4>
                        <p className="text-sm text-gray-300 mt-1">
                          <span className="font-semibold">Offering:</span> {exchange.skillOffered}
                        </p>
                        <p className="text-sm text-gray-300">
                          <span className="font-semibold">Requesting:</span> {exchange.skillRequested}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Mode: {exchange.preferredMode}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-yellow-400 mb-4">Monthly Activity</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activityByMonth()}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                      <XAxis dataKey="name" stroke="#E5E7EB" />
                      <YAxis stroke="#E5E7EB" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="posts" fill="#F59E0B" name="Posts" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-gray-300 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-600 p-3 rounded">
                    <h4 className="font-medium text-yellow-300">Most Active Month</h4>
                    <p className="text-sm">
                      {activityByMonth().reduce((max, month) => max.posts > month.posts ? max : month, {posts: 0}).name}
                    </p>
                  </div>
                  <div className="bg-gray-600 p-3 rounded">
                    <h4 className="font-medium text-yellow-300">Total Posts This Year</h4>
                    <p className="text-sm">
                      {activityByMonth().reduce((sum, month) => sum + month.posts, 0)}
                    </p>
                  </div>
                  <div className="bg-gray-600 p-3 rounded">
                    <h4 className="font-medium text-yellow-300">Average Posts/Month</h4>
                    <p className="text-sm">
                      {(activityByMonth().reduce((sum, month) => sum + month.posts, 0) / 12)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyzePage;