import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import ReadAloudWrapper from '../components/ReadAloudWrapper';
import './Wallet.css';

const Wallet = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const balance = 1250;

  const getTransactionIcon = (type, title) => {
    if (title.includes('Ride')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M5 17H19M5 17C3.89543 17 3 17.8954 3 19C3 20.1046 3.89543 21 5 21C6.10457 21 7 20.1046 7 19M5 17C5 17.5523 5.44772 18 6 18H18C18.5523 18 19 17.5523 19 17M19 17C19 17.5523 19.4477 18 20 18C20.5523 18 21 17.5523 21 17C21 16.4477 20.5523 16 20 16H19V17ZM7 19C7 17.8954 6.10457 17 5 17M7 19C7 20.1046 6.10457 21 5 21M16 8L18 3H6L8 8M16 8H8M16 8L18 10V15H6V10L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else if (title.includes('Money Added')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M1 10H23M7 15H7.01M11 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    } else if (title.includes('Cashback')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20 12V22H4V12M2 7H22M12 2V7M8 12V17M16 12V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else if (title.includes('Refund')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 14L4 9M4 9L9 4M4 9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    return null;
  };

  const transactions = [
    {
      id: 1,
      type: 'debit',
      title: 'Ride Payment',
      description: 'To Gulshan-e-Iqbal',
      amount: -285,
      date: 'Nov 24, 2025',
      time: '3:45 PM'
    },
    {
      id: 2,
      type: 'credit',
      title: 'Money Added',
      description: 'Via Credit Card',
      amount: 1000,
      date: 'Nov 23, 2025',
      time: '11:20 AM'
    },
    {
      id: 3,
      type: 'credit',
      title: 'Cashback',
      description: 'Weekend Offer',
      amount: 85,
      date: 'Nov 22, 2025',
      time: '6:30 PM'
    },
    {
      id: 4,
      type: 'debit',
      title: 'Ride Payment',
      description: 'To Clifton Beach',
      amount: -450,
      date: 'Nov 22, 2025',
      time: '2:15 PM'
    },
    {
      id: 5,
      type: 'credit',
      title: 'Refund',
      description: 'Cancelled Ride',
      amount: 180,
      date: 'Nov 21, 2025',
      time: '9:45 AM'
    }
  ];

  return (
    <div className="wallet-container">
      {/* Header */}
      <div className="wallet-header">
        <button className="wallet-back-btn" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="wallet-title">{t('wallet.title')}</h1>
      </div>

      {/* Balance Card */}
      <div className="wallet-balance-card">
        <div className="balance-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
            <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" />
            <path d="M1 10H23" stroke="#00a859" strokeWidth="2"/>
          </svg>
        </div>
        <p className="balance-label">{t('wallet.balance')}</p>
        <h2 className="balance-amount">Rs. {balance.toLocaleString()}</h2>
        <button className="add-money-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {t('wallet.addMoney')}
        </button>
      </div>

      {/* Transactions Section */}
      <div className="transactions-section">
        <div className="transactions-header">
          <h3 className="transactions-title">{t('wallet.recentTransactions')}</h3>
          <button className="view-all-btn">{t('wallet.viewAll')}</button>
        </div>

        <div className="transactions-list">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-icon">
                {getTransactionIcon(transaction.type, transaction.title)}
              </div>
              <div className="transaction-details">
                <h4 className="transaction-title">
                  {transaction.type === 'debit' ? t('wallet.ridePayment') : 
                   transaction.title === 'Money Added' ? t('wallet.moneyAdded') :
                   transaction.title === 'Refund' ? t('wallet.refund') :
                   t('wallet.cashback')}
                </h4>
                <p className="transaction-description">{transaction.description}</p>
                <span className="transaction-datetime">{transaction.date} • {transaction.time}</span>
              </div>
              <div className={`transaction-amount ${transaction.type}`}>
                <span className="amount-value">
                  {transaction.amount > 0 ? '+' : ''}Rs. {Math.abs(transaction.amount)}
                </span>
                <span className="amount-type">
                  {transaction.type === 'credit' ? t('wallet.credit') : t('wallet.debit')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
