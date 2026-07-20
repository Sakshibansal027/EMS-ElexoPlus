import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Project Theme se match karti hui custom styling (Matt Dark / Amber Accent)
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#141414', // Light background chaho toh change kar sakte ho, par dark theme standard hai
    color: '#e4e4e7',
    fontFamily: 'Helvetica',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    paddingBottom: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFC107', // Amber Accent
  },
  subtitle: {
    fontSize: 10,
    color: '#a1a1aa',
    marginTop: 4,
  },
  // Table Structures
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 0,
    marginBottom: 20,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    padding: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1c',
    padding: 8,
  },
  // Table Columns Width Customisation
  colName: { width: '25%', fontSize: 10, color: '#ffffff' },
  colCompany: { width: '25%', fontSize: 10, color: '#a1a1aa' },
  colPhone: { width: '15%', fontSize: 10, color: '#a1a1aa' },
  colValue: { width: '20%', fontSize: 10, color: '#FFC107', fontWeight: 'bold' },
  colStatus: { width: '15%', fontSize: 10, textAlign: 'right' },
  
  headerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFC107',
  }
});

// Ye hai hamara PDF Document Layout Component
export const LeadsPDFDocument = ({ filteredLeads }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Brand Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Lead Management Report</Text>
        <Text style={styles.subtitle}>Generated on: {new Date().toLocaleDateString('en-IN')}</Text>
      </View>

      {/* Main Table Grid */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRowHeader}>
          <Text style={[styles.colName, styles.headerText]}>Lead Name</Text>
          <Text style={[styles.colCompany, styles.headerText]}>Company</Text>
          <Text style={[styles.colPhone, styles.headerText]}>Phone</Text>
          <Text style={[styles.colValue, styles.headerText]}>Deal Value</Text>
          <Text style={[styles.colStatus, styles.headerText]}>Status</Text>
        </View>

        {/* Table Body Rows */}
        {filteredLeads.map((lead) => (
          <View style={styles.tableRow} key={lead.id}>
            <Text style={styles.colName}>{lead.name || '—'}</Text>
            <Text style={styles.colCompany}>{lead.company || '—'}</Text>
            <Text style={styles.colPhone}>{lead.phone || '—'}</Text>
            <Text style={styles.colValue}>{lead.value || '—'}</Text>
            <Text style={styles.colStatus}>{lead.status || '—'}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);