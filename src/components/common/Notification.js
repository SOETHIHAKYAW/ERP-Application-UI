class Notification {
    static show(message, type = 'info') {
      // You can implement your notification logic here
      alert(`[${type.toUpperCase()}] ${message}`);
    }
  }
  
  export default Notification;
  