let id_medecin = 1; // Cet ID doit être récupéré lors de la connexion
        let id_visite = 2;

        function addCalendarEntry() {
            const container = document.getElementById("calendarContainer");
            
            // Remove empty state if it exists
            const emptyState = container.querySelector(".empty-state");
            if (emptyState) {
                container.removeChild(emptyState);
            }

            const entryDiv = document.createElement("div");
            entryDiv.className = "calendar-entry";
            
            const dateInput = document.createElement("input");
            dateInput.type = "date";
            dateInput.required = true;
            
            const timeContainer = document.createElement("div");
            timeContainer.className = "time-container";
            
            // Add initial time input
            addTimeInput(timeContainer);
            
            const addTimeButton = document.createElement("button");
            addTimeButton.className = "btn-primary";
            addTimeButton.innerHTML = '<i class="fas fa-plus"></i> Ajouter heure';
            addTimeButton.onclick = () => addTimeInput(timeContainer);
            
            entryDiv.appendChild(dateInput);
            entryDiv.appendChild(timeContainer);
            entryDiv.appendChild(addTimeButton);
            container.appendChild(entryDiv);
            
            // Scroll to the new entry
            entryDiv.scrollIntoView({ behavior: 'smooth' });
        }

        function addTimeInput(container) {
            const timeInputGroup = document.createElement("div");
            timeInputGroup.className = "time-input-group";
            
            const timeInput = document.createElement("input");
            timeInput.type = "time";
            timeInput.required = true;
            
            const removeButton = document.createElement("button");
            removeButton.className = "remove-time";
            removeButton.innerHTML = '<i class="fas fa-times"></i>';
            removeButton.onclick = () => {
                container.removeChild(timeInputGroup);
                // If no more time inputs left, add one automatically
                if (container.querySelectorAll("input[type='time']").length === 0) {
                    addTimeInput(container);
                }
            };
            
            timeInputGroup.appendChild(timeInput);
            timeInputGroup.appendChild(removeButton);
            container.appendChild(timeInputGroup);
            
            // Focus the new time input
            timeInput.focus();
        }

        async function sendDisponibilites() {
            const disponibilites = [];
            let isValid = true;
            
            document.querySelectorAll("#calendarContainer > .calendar-entry").forEach(entry => {
                const dateInput = entry.querySelector("input[type='date']");
                const date = dateInput.value;
                
                if (!date) {
                    dateInput.style.borderColor = "red";
                    isValid = false;
                } else {
                    dateInput.style.borderColor = "";
                }
                
                entry.querySelectorAll("input[type='time']").forEach(timeInput => {
                    const time = timeInput.value;
                    if (time) {
                        disponibilites.push({ date, heure: time });
                    } else if (!timeInput.disabled) {
                        timeInput.style.borderColor = "red";
                        isValid = false;
                    }
                });
            });

            if (!isValid) {
                alert("Veuillez remplir tous les champs requis (marqués en rouge)");
                return;
            }

            if (disponibilites.length === 0) {
                alert("Veuillez saisir au moins une disponibilité valide !");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/ajouter-disponibilite", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_medecin, disponibilites })
                });

                const result = await response.json();
                
                if (response.ok) {
                    // Show success message with icon
                    alert("✓ " + result.message);
                    // Optionally clear the form
                    document.getElementById("calendarContainer").innerHTML = `
                        <div class="empty-state">
                            <i class="far fa-calendar-check"></i>
                            <p>Vos disponibilités ont été enregistrées avec succès!</p>
                        </div>
                    `;
                } else {
                    throw new Error(result.error || "Erreur inconnue");
                }
            } catch (error) {
                console.error("Erreur:", error);
                alert("✗ Erreur lors de l'enregistrement: " + error.message);
            }
        }