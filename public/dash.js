document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const menuItems = document.querySelectorAll('.menu-item');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('page-title');
    
    // Variables de navigation
    let currentAction = null;

    // Initialisation
    showPage('dashboard');
    setupEventListeners();

    function setupEventListeners() {
        // Navigation menu
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                const pageId = this.getAttribute('data-page');
                showPage(pageId);
                
                // Mettre à jour le menu actif
                menuItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active-page'));
        document.getElementById(`${pageId}-page`).classList.add('active-page');
        
        // Mettre à jour le titre de la page
        switch(pageId) {
            case 'dashboard':
                pageTitle.textContent = 'Tableau de bord';
                break;
            case 'patients':
                pageTitle.textContent = 'Gestion des Patients';
                break;
            case 'doctors':
                pageTitle.textContent = 'Gestion des Médecins';
                break;
            case 'add-doctor':
                pageTitle.textContent = 'Ajouter un Médecin';
                break;
        }
    }
});
