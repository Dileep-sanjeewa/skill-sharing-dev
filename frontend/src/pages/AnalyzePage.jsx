import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Layout from "../components/Layout";
import axios from "axios";
import { FiDownload, FiUser, FiActivity, FiTrendingUp, FiShare2 } from 'react-icons/fi';
import { saveAs } from 'file-saver';

// =============================================
// Utility Functions
// =============================================
const safeNumber = (value, fallback = 0) => 
  Number.isFinite(value) ? value : fallback;

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'N/A';
  }
};

// =============================================
// PDF Document Styles
// =============================================
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: '#2D3748',
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottom: '2px solid #F59E0B',
    paddingBottom: 10,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    border: '1px solid #E2E8F0',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: '#2D3748',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableHeader: {
    backgroundColor: '#F59E0B',
    color: '#FFFFFF',
    padding: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #E2E8F0',
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    color: '#2D3748',
  },
  highlightBox: {
    backgroundColor: '#EBF8FF',
    padding: 12,
    borderRadius: 6,
    border: '1px solid #90CDF4',
    marginBottom: 10,
  },
  highlightText: {
    fontSize: 12,
    color: '#2C5282',
    fontWeight: 'bold',
  },
  statBadge: {
    backgroundColor: '#F59E0B',
    color: '#FFFFFF',
    borderRadius: 4,
    padding: '4px 8px',
    fontSize: 10,
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#718096',
  },
  chartContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F59E0B',
    borderRadius: 2,
  },
  emptyState: {
    fontSize: 10,
    color: '#718096',
    marginTop: 8,
    textAlign: 'center',
  },
});

// =============================================
// PDF Document Component
// =============================================
class PDFErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('PDF Error:', error, info);
  }

  render() {
    return this.state.hasError ? (
      <Text style={styles.emptyState}>Error rendering PDF content</Text>
    ) : (
      this.props.children
    );
  }
}

const MyDocument = ({ userData, postData, progressData, skillExchangeData }) => {
  // Data processing with safety checks
  const topPosts = [...postData]
    .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
    .slice(0, 3);

  const monthlyActivity = Array(12).fill().map((_, i) => {
    const month = new Date(0, i).toLocaleString('en-US', { month: 'short' });
    const count = postData.filter(post => 
      post?.date && new Date(post.date).getMonth() === i
    ).length;
    return { month, count };
  });

  const skillDistribution = progressData.reduce((acc, curr) => {
    if (curr?.skill) {
      acc[curr.skill] = (acc[curr.skill] || 0) + 1;
    }
    return acc;
  }, {});

  const hasData = postData.length > 0 || progressData.length > 0 || skillExchangeData.length > 0;

  return (
    <Document>
      <PDFErrorBoundary>
        <Page size="A4" style={styles.page}>
          <Text style={styles.header}>Skill Analytics Report</Text>
          
          {/* User Profile */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Profile</Text>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>Name</Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>{userData?.name || 'N/A'}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Email</Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>{userData?.email || 'N/A'}</Text>
            </View>
           
          </View>

          {/* Key Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
              <View style={styles.highlightBox}>
                <Text style={styles.highlightText}>
                  Total Posts: {postData.length}  Posts
                </Text>
              </View>
              <View style={styles.highlightBox}>
                <Text style={styles.highlightText}>
                  Avg. Likes: {safeNumber(
                    postData.reduce((a, b) => a + (b.likeCount || 0), 0) / 
                    (postData.length || 1)
                  ).toFixed(1)}
                </Text>
              </View>
              <View style={styles.highlightBox}>
                <Text style={styles.highlightText}>
                  Skill Exchanges: {skillExchangeData.length}
                </Text>
              </View>
            </View>
          </View>

          {/* Post Analytics */}
          {postData.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Post Analytics</Text>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { flex: 3 }]}>Top Liked Posts</Text>
                <Text style={styles.tableCell}>Likes</Text>
                <Text style={styles.tableCell}>Comments</Text>
                <Text style={styles.tableCell}>Date</Text>
              </View>
              {topPosts.map((post, i) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 3 }]}>{post.title || 'Untitled Post'}</Text>
                  <Text style={styles.tableCell}>{safeNumber(post.likeCount)}</Text>
                  <Text style={styles.tableCell}>{safeNumber(post.comments?.length)}</Text>
                  <Text style={styles.tableCell}>{formatDate(post.date)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.emptyState}>No post data available</Text>
            </View>
          )}

          {/* Skill Progress */}
          {progressData.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skill Progress</Text>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { flex: 4 }]}>Milestone</Text>
                <Text style={styles.tableCell}>Progress</Text>
                <Text style={styles.tableCell}>Last Updated</Text>
              </View>
              {progressData.map((progress, i) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 4 }]}>
                    {progress.milestone || 'Untitled Milestone'}
                    <Text style={{ color: '#718096' }}> - {progress.description || 'No description'}</Text>
                  </Text>
                  <Text style={styles.tableCell}>{safeNumber(progress.completionPercentage)}%</Text>
                  <Text style={styles.tableCell}>{formatDate(progress.date)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.emptyState}>No progress data available</Text>
            </View>
          )}

          {/* Monthly Activity */}
          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Activity</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {monthlyActivity.map((month, i) => {
                const maxCount = Math.max(1, ...monthlyActivity.map(m => m.count));
                const widthPercentage = safeNumber(
                  (month.count / maxCount) * 100,
                  0
                );

                return (
                  <View key={i} style={{ width: '25%', marginBottom: 10 }}>
                    <Text style={{ fontSize: 10, color: '#4A5568' }}>
                      {month.month}: {month.count} posts
                    </Text>
                    <View style={{
                      height: 4,
                      width: `${widthPercentage}%`,
                      backgroundColor: '#F59E0B',
                      marginTop: 4,
                    }}/>
                  </View>
                );
              })}
            </View>
          </View> */}

          {/* Skill Distribution */}
          {/* {Object.keys(skillDistribution).length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skill Distribution</Text>
              <View style={styles.chartContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  {Object.entries(skillDistribution).map(([skill, count], i) => {
                    const maxCount = Math.max(1, ...Object.values(skillDistribution));
                    const widthPercentage = safeNumber(
                      (count / maxCount) * 100,
                      0
                    );

                    return (
                      <View key={i} style={{ width: `${100 / Object.keys(skillDistribution).length}%`, padding: 5 }}>
                        <View style={[styles.progressBar, { width: `${widthPercentage}%` }]} />
                        <Text style={{ fontSize: 8, color: '#4A5568', marginTop: 4 }}>
                          {skill}: {count}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.emptyState}>No skill distribution data available</Text>
            </View>
          )} */}

          <Text style={styles.footer}>
            Generated on {new Date().toLocaleDateString()} • Skill Sharing Platform Analytics
          </Text>
        </Page>
      </PDFErrorBoundary>
    </Document>
  );
};

// =============================================
// Main Analyze Page Component
// =============================================
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
          
          const postsRes = await axios.get(`http://localhost:8080/posts/user/${parsedUser.id}`);
          setPostData(postsRes.data || []);
          
          const progressRes = await axios.get(`http://localhost:8080/progress`);
          const userProgress = (progressRes.data || []).filter(p => p.userId === parsedUser.id);
          setProgressData(userProgress);
          
          const exchangeRes = await axios.get(`http://localhost:8080/skillExchange`);
          const userExchanges = (exchangeRes.data || []).filter(e => e.userId === parsedUser.id);
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

  const getPostChartData = () => [
    { name: 'Posts', value: postData.length },
    { name: 'Likes', value: postData.reduce((acc, post) => acc + (post.likeCount || 0), 0) },
    { name: 'Comments', value: postData.reduce((acc, post) => acc + (post.comments?.length || 0), 0) },
  ];

  const getProgressChartData = () => 
    progressData.map(progress => ({
      name: progress.milestone,
      progress: progress.completionPercentage,
    }));

  const getMonthlyActivity = () => {
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

  const canGeneratePDF = postData.length > 0 || 
    progressData.length > 0 || 
    skillExchangeData.length > 0;

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

  return (
    <Layout>
      <div style={{ backgroundColor: "#5dade2" }} className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FiActivity className="mr-2 text-yellow-500" />
                  Skill Analytics Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Insights and statistics for {user.name}
                </p>
              </div>
              <PDFDownloadLink 
                document={<MyDocument 
                  userData={user} 
                  postData={postData}
                  progressData={progressData}
                  skillExchangeData={skillExchangeData}
                />}
                fileName="skill_analytics_report.pdf"
              >
                {({ blob, url, loading, error }) => {
                  console.log('PDF State:', { blob, url, loading, error });
                  
                  if (error) {
                    return (
                      <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center">
                        <FiDownload className="mr-2" />
                        Error Generating PDF
                      </button>
                    );
                  }

                  if (loading) {
                    return (
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center">
                        <FiDownload className="mr-2" />
                        Preparing Report...
                      </button>
                    );
                  }

                  return (
                    <button 
                      className={`bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 ${
                        !canGeneratePDF ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => {
                        if (blob && canGeneratePDF) {
                          const pdfBlob = new Blob([blob], { type: 'application/pdf' });
                          saveAs(pdfBlob, 'skill_analytics_report.pdf');
                        }
                      }}
                      disabled={!canGeneratePDF}
                    >
                      <FiDownload className="mr-2" />
                      {canGeneratePDF ? 'Download PDF Report' : 'No Data to Export'}
                    </button>
                  );
                }}
              </PDFDownloadLink>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {['posts', 'progress', 'exchange', 'activity'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md flex items-center capitalize ${
                    activeTab === tab 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'posts' && <FiShare2 className="mr-2" />}
                  {tab === 'progress' && <FiTrendingUp className="mr-2" />}
                  {tab === 'exchange' && <FiUser className="mr-2" />}
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              {activeTab === 'posts' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FiShare2 className="mr-2 text-yellow-500" />
                      Post Statistics
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getPostChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {getPostChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Posts</p>
                        <p className="text-2xl font-bold text-gray-900">{postData.length}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Likes</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {postData.reduce((acc, post) => acc + (post.likeCount || 0), 0)}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Comments</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {postData.reduce((acc, post) => acc + (post.comments?.length || 0), 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FiTrendingUp className="mr-2 text-yellow-500" />
                      Top Performing Posts
                    </h3>
                    <div className="space-y-4">
                      {[...postData]
                        .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
                        .slice(0, 3)
                        .map((post, index) => (
                          <div key={post.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  #{index + 1} {post.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {post.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                                  {post.likeCount || 0} likes
                                </span>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(post.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'progress' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FiTrendingUp className="mr-2 text-yellow-500" />
                      Skill Progress Overview
                    </h3>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getProgressChartData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="progress" fill="#F59E0B" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FiTrendingUp className="mr-2 text-yellow-500" />
                      Recent Progress Updates
                    </h3>
                    <div className="space-y-4">
                      {progressData.slice(0, 5).map((progress) => (
                        <div key={progress.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {progress.milestone}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                {progress.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                {progress.completionPercentage}%
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(progress.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'exchange' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FiShare2 className="mr-2 text-yellow-500" />
                      Skill Exchange Overview
                    </h3>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Completed', value: skillExchangeData.filter(e => e.status === 'completed').length },
                              { name: 'Pending', value: skillExchangeData.filter(e => e.status === 'pending').length },
                              { name: 'In Progress', value: skillExchangeData.filter(e => e.status === 'in_progress').length },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FiShare2 className="mr-2 text-yellow-500" />
                      Recent Exchanges
                    </h3>
                    <div className="space-y-4">
                      {skillExchangeData.slice(0, 5).map((exchange) => (
                        <div key={exchange.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {exchange.skillOffered} ↔ {exchange.skillRequested}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {exchange.preferredMode} • {exchange.status}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-2 py-1 text-sm rounded-full ${
                                exchange.status === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : exchange.status === 'in_progress'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {exchange.status}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(exchange.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <FiActivity className="mr-2 text-yellow-500" />
                    Monthly Activity Breakdown
                  </h3>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getMonthlyActivity()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="posts" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyzePage;