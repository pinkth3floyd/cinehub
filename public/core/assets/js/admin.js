(function (window, document, undefined) {
	'use strict';

	/*==============================
	Admin Header
	==============================*/
	if (document.querySelector('.header')) {
		const headerBtn = document.querySelector('.header__btn');

		function toggleHeaderMenu() {
			// Toggle sidebar visibility
			const sidebar = document.querySelector('.sidebar');
			if (sidebar) {
				sidebar.classList.toggle('sidebar--active');
			}
		}

		if (headerBtn) {
			headerBtn.addEventListener('click', toggleHeaderMenu);
		}
	}

	/*==============================
	Admin Sidebar
	==============================*/
	if (document.querySelector('.sidebar')) {
		// Handle sidebar dropdown
		const dropdownToggle = document.querySelector('[aria-expanded]');
		const dropdownMenu = document.querySelector('.sidebar__dropdown-menu');

		if (dropdownToggle && dropdownMenu) {
			dropdownToggle.addEventListener('click', function(e) {
				e.preventDefault();
				const isExpanded = this.getAttribute('aria-expanded') === 'true';
				this.setAttribute('aria-expanded', !isExpanded);
				dropdownMenu.classList.toggle('show');
			});
		}

		// Handle logout button
		const logoutBtn = document.querySelector('.sidebar__user-btn');
		if (logoutBtn) {
			logoutBtn.addEventListener('click', function() {
				// Add logout functionality here
				console.log('Logout clicked');
			});
		}
	}

	/*==============================
	Admin Tables
	==============================*/
	if (document.querySelector('.dashbox__table')) {
		// Add any table-specific functionality here
		const tableRows = document.querySelectorAll('.dashbox__table tbody tr');
		
		tableRows.forEach(row => {
			row.addEventListener('click', function() {
				// Add row click functionality if needed
			});
		});
	}

	/*==============================
	Admin Forms
	==============================*/
	if (document.querySelector('.btn-primary')) {
		const saveButtons = document.querySelectorAll('.btn-primary');
		
		saveButtons.forEach(button => {
			button.addEventListener('click', function(e) {
				e.preventDefault();
				// Add save functionality here
				console.log('Save button clicked');
			});
		});
	}

	/*==============================
	Responsive Admin
	==============================*/
	function handleResize() {
		const sidebar = document.querySelector('.sidebar');
		const main = document.querySelector('.main');
		
		if (window.innerWidth <= 1200) {
			if (sidebar) {
				sidebar.classList.remove('sidebar--active');
			}
		}
	}

	window.addEventListener('resize', handleResize);
	handleResize(); // Call on initial load

})(window, document); 