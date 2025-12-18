import { jwtDecode } from "jwt-decode";

class TokenManager {
  constructor() {
    this.checkInterval = null;
    this.warningShown = false;
    this.onTokenExpiring = null;
    this.onTokenExpired = null;
  }

  /**
   * Start monitoring token expiry
   */
  startMonitoring(onTokenExpiring, onTokenExpired) {
    this.onTokenExpiring = onTokenExpiring;
    this.onTokenExpired = onTokenExpired;

    // Check immediately
    this.checkTokenExpiry();

    // Check every minute
    this.checkInterval = setInterval(() => {
      this.checkTokenExpiry();
    }, 60000); // 1 minute
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.warningShown = false;
  }

  /**
   * Check token expiry and trigger callbacks
   */
  checkTokenExpiry() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = decoded.exp - currentTime;

      // Token has already expired
      if (timeUntilExpiry <= 0) {
        if (this.onTokenExpired) {
          this.onTokenExpired();
        }
        return;
      }

      // Token expires within 5 minutes (300 seconds)
      if (timeUntilExpiry <= 300 && !this.warningShown) {
        this.warningShown = true;
        if (this.onTokenExpiring) {
          this.onTokenExpiring(Math.ceil(timeUntilExpiry / 60)); // minutes remaining
        }
      }

      // Reset warning if token was refreshed
      if (timeUntilExpiry > 300) {
        this.warningShown = false;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      if (this.onTokenExpired) {
        this.onTokenExpired();
      }
    }
  }

  /**
   * Get token expiry info
   */
  getTokenInfo() {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = decoded.exp - currentTime;

      return {
        valid: timeUntilExpiry > 0,
        expired: timeUntilExpiry <= 0,
        expiresAt: decoded.exp,
        timeUntilExpiry: Math.max(0, timeUntilExpiry),
        minutesRemaining: Math.ceil(Math.max(0, timeUntilExpiry) / 60),
        userId: decoded.user_id,
        email: decoded.email,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Reset warning state to allow showing warning again
   */
  resetWarning() {
    this.warningShown = false;
  }
}

// Export singleton instance
export default new TokenManager();
