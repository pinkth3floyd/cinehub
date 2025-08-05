import React from 'react';
import AdminLayout from '../../core/ui/components/AdminLayout';
import Dashbox from '../../core/ui/components/Dashbox';

const SettingsPage = () => {

  return (
    <AdminLayout>
      {/* main title */}
      <div className="row">
        <div className="col-12">
          <div className="main__title">
            <h2>Settings</h2>
          </div>
        </div>
      </div>
      {/* end main title */}

      <div className="row">
        <div className="col-12 col-xl-6">
          <Dashbox
            title="General Settings"
            icon="ti ti-settings"
          >
            <div className="dashbox__table-wrap">
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '500' }}>
                    Site Name
                  </label>
                  <input 
                    type="text" 
                    defaultValue="CineHub" 
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      background: '#2a2a2a',
                      color: '#fff'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '500' }}>
                    Site Description
                  </label>
                  <textarea 
                    defaultValue="Online Movies, TV Shows & Cinema"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      background: '#2a2a2a',
                      color: '#fff',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '500' }}>
                    Admin Email
                  </label>
                  <input 
                    type="email" 
                    defaultValue="admin@cinehub.com" 
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      background: '#2a2a2a',
                      color: '#fff'
                    }}
                  />
                </div>
                
                <button 
                  className="btn btn-primary"
                  style={{ marginTop: '10px' }}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </Dashbox>
        </div>

        <div className="col-12 col-xl-6">
          <Dashbox
            title="Security Settings"
            icon="ti ti-shield"
          >
            <div className="dashbox__table-wrap">
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '500' }}>
                    Current Password
                  </label>
                  <input 
                    type="password" 
                    placeholder="Enter current password"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      background: '#2a2a2a',
                      color: '#fff'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '500' }}>
                    New Password
                  </label>
                  <input 
                    type="password" 
                    placeholder="Enter new password"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      background: '#2a2a2a',
                      color: '#fff'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '500' }}>
                    Confirm New Password
                  </label>
                  <input 
                    type="password" 
                    placeholder="Confirm new password"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      background: '#2a2a2a',
                      color: '#fff'
                    }}
                  />
                </div>
                
                <button 
                  className="btn btn-primary"
                  style={{ marginTop: '10px' }}
                >
                  Change Password
                </button>
              </div>
            </div>
          </Dashbox>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage; 