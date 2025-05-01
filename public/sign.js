document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const submitBtn = document.getElementById('submit-btn');
    const formError = document.getElementById('form-error');
    const formSuccess = document.getElementById('form-success');

    // Fonctions de validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 8;
    }

    function validateName(name) {
        const re = /^[a-zA-ZÀ-ÿ\- ]+$/;
        return re.test(name);
    }

    function validatePassword(password) {
        return password.length >= 8;
    }

    function validateTaille(taille) {
        return taille >= 130 && taille <= 230;
    }

    function validatePoids(poids) {
        return poids >= 20 && poids <= 350;
    }

    // Fonctions d'affichage d'erreur
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        field.classList.add('error-field');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function hideError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        field.classList.remove('error-field');
        errorElement.style.display = 'none';
    }

    // Fonction pour vérifier si un champ est valide
    function isFieldValid(fieldId, value) {
        switch(fieldId) {
            case 'first-name':
            case 'last-name':
                return validateName(value);
            case 'email':
                return validateEmail(value);
            case 'phone-number':
                return validatePhone(value);
            case 'password':
                return validatePassword(value);
            case 'taille':
                return value === '' || validateTaille(value);
            case 'poids':
                return value === '' || validatePoids(value);
            case 'date-of-birth':
                return value.trim() !== '';
            default:
                return true;
        }
    }

    // Validation en temps réel
    form.addEventListener('input', function(e) {
        const field = e.target;
        const fieldId = field.id;
        const value = field.value.trim();
        
        if (value === '') {
            hideError(fieldId);
            return;
        }
        
        if (!isFieldValid(fieldId, value)) {
            switch(fieldId) {
                case 'first-name':
                case 'last-name':
                    showError(fieldId, 'Seuls les caractères alphabétiques sont autorisés');
                    break;
                case 'email':
                    showError(fieldId, 'Veuillez entrer une adresse email valide');
                    break;
                case 'phone-number':
                    showError(fieldId, 'Le numéro doit contenir au moins 8 chiffres');
                    break;
                case 'taille':
                    showError(fieldId, 'La taille doit être entre 130 et 230 cm');
                    break;
                case 'poids':
                    showError(fieldId, 'Le poids doit être entre 20 et 350 kg');
                    break;
                case 'password':
                    showError(fieldId, 'Le mot de passe doit contenir au moins 8 caractères');
                    break;
            }
        } else {
            hideError(fieldId);
        }
    });

    // Validation à la soumission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        let firstErrorField = null;
        
        // Réinitialiser les messages
        formError.style.display = 'none';
        formSuccess.style.display = 'none';
        
        // Valider tous les champs
        const fieldsToValidate = [
            { id: 'first-name', validator: validateName, error: 'Prénom invalide' },
            { id: 'last-name', validator: validateName, error: 'Nom invalide' },
            { id: 'email', validator: validateEmail, error: 'Email invalide' },
            { id: 'phone-number', validator: validatePhone, error: 'Numéro invalide' },
            { id: 'date-of-birth', validator: (v) => v.trim() !== '', error: 'Date requise' },
            { id: 'password', validator: validatePassword, error: '8 caractères minimum' },
            { id: 'taille', validator: validateTaille, error: '130-230 cm', optional: true },
            { id: 'poids', validator: validatePoids, error: '20-350 kg', optional: true }
        ];
        
        fieldsToValidate.forEach(({id, validator, error, optional}) => {
            const field = document.getElementById(id);
            const value = field.value.trim();
            
            if ((!optional && value === '') || (value !== '' && !validator(value))) {
                showError(id, error);
                isValid = false;
                
                // Garder une référence au premier champ invalide
                if (!firstErrorField) {
                    firstErrorField = field;
                }
            }
        });
        
        // Valider le genre
        const genderSelected = document.querySelector('input[name="genre"]:checked');
        if (!genderSelected) {
            document.getElementById('gender-error').textContent = 'Veuillez sélectionner un genre';
            document.getElementById('gender-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('gender-error').style.display = 'none';
        }
        
        if (!isValid) {
            formError.textContent = 'Veuillez corriger les erreurs dans le formulaire';
            formError.style.display = 'block';
            
            // Faire défiler jusqu'au premier champ invalide
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstErrorField.focus();
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
        }
        
        // Si tout est valide, procéder à l'envoi
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';
        
        // Simulation d'envoi (remplacer par un vrai appel API)
        setTimeout(() => {
            formSuccess.textContent = 'Inscription réussie!';
            formSuccess.style.display = 'block';

            
            submitBtn.classList.add('success-btn');
            submitBtn.textContent = 'Inscription validée ✅';

            setTimeout(() => {
                form.reset();
                submitBtn.classList.remove('success-btn');
                submitBtn.disabled = false;
                submitBtn.textContent = 'S\'inscrire';
                formSuccess.style.display = 'none';

                // Réinitialiser les erreurs
                document.querySelectorAll('.error-text').forEach(el => {
                el.style.display = 'none';
                    });
                document.querySelectorAll('.error-field').forEach(el => {
                el.classList.remove('error-field');
                    });
                    }, 2000);

            
            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'S\'inscrire';
                formSuccess.style.display = 'none';
                
                // Réinitialiser les erreurs
                document.querySelectorAll('.error-text').forEach(el => {
                    el.style.display = 'none';
                });
                document.querySelectorAll('.error-field').forEach(el => {
                    el.classList.remove('error-field');
                });
            }, 2000);
        }, 1500);
    });

    // Animation pour les champs focus
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#2AA8FF';
            this.style.boxShadow = '0 0 5px rgba(42, 168, 255, 0.5)';
        });
        
        input.addEventListener('blur', function() {
            this.style.boxShadow = 'none';
        });
    });

    // Fonction pour vérifier si tout le formulaire est valide
    function isFormValid() {
        let isValid = true;
        
        const fieldsToValidate = [
            { id: 'first-name', validator: validateName },
            { id: 'last-name', validator: validateName },
            { id: 'email', validator: validateEmail },
            { id: 'phone-number', validator: validatePhone },
            { id: 'date-of-birth', validator: (v) => v.trim() !== '' },
            { id: 'password', validator: validatePassword },
            { id: 'taille', validator: validateTaille, optional: true },
            { id: 'poids', validator: validatePoids, optional: true }
        ];
        
        fieldsToValidate.forEach(({id, validator, optional}) => {
            const field = document.getElementById(id);
            const value = field.value.trim();
            
            if ((!optional && value === '') || (value !== '' && !validator(value))) {
                isValid = false;
            }
        });
        
        const genderSelected = document.querySelector('input[name="genre"]:checked');
        if (!genderSelected) {
            isValid = false;
        }
        
        return isValid;
    }

    // Activer/désactiver le bouton de soumission en fonction de la validité du formulaire
    form.addEventListener('input', function() {
        submitBtn.disabled = !isFormValid();
    });
});