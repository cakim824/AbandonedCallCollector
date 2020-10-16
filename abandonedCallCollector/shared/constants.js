const CALL_CATCHER_TYPES = {
    WAIT_MENT_ABANDONED: '00001',
    SYSTEM_ABANDONED: '00002',
    RING_ABANDONED: '00003',
  };
  
  const BATCH_NAME = 'call-catcher';
  
  /**
   * PENDING:   배치 작업중
   * COMPLETED: 완료
   * FAILED:    실패
   */
  const BATCH_STATUS = {
    PENDING:   'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED:    'FAILED',
  }
  
  module.exports = {
    CALL_CATCHER_TYPES,
    BATCH_NAME,
    BATCH_STATUS,
  };
  