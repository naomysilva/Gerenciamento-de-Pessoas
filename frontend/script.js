document.addEventListener("DOMContentLoaded", () => {
  const personForm = document.getElementById("personForm");
  const personNameInput = document.getElementById("name");
  const personSalaryInput = document.getElementById("salary");
  const personApprovedInput = document.getElementById("approved");
  const personTraineeInput = document.getElementById("trainee");
  const personDataInicioInput = document.getElementById("dataInicio");
  const personDataFimInput = document.getElementById("dataFim");
  const resultDiv = document.getElementById("result");
  const personList = document.getElementById("personList");

  // Function to create or update a person
  async function createOrUpdatePerson(e) {
      e.preventDefault();

      const personData = {
          name: personNameInput.value,
          salary: parseFloat(personSalaryInput.value),
          approved: personApprovedInput.checked,
          trainee: personTraineeInput.value,
          dataInicio: new Date(personDataInicioInput.value),
          dataFim: new Date(personDataFimInput.value)
      };

      try {
          const response = await fetch("http://localhost:3000/person", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(personData)
          });

          const data = await response.json();
          resultDiv.textContent = data.message || data.error;

          if (response.ok) {
              loadPersonList(); // Refresh list after creating/updating a person
          }
      } catch (error) {
          console.error("Erro ao criar ou atualizar a pessoa:", error);
      }
  }

  // Function to check if a person exists
  async function checkPersonExists() {
      const personName = personNameInput.value;

      try {
          const response = await fetch(`http://localhost:3000/person/exists/${personName}`);
          const data = await response.json();

          resultDiv.textContent = data.message;
      } catch (error) {
          console.error("Erro ao verificar se a pessoa existe:", error);
      }
  }

  // Function to delete a person
  async function deletePerson(name) {
      try {
          const response = await fetch(`http://localhost:3000/person/${name}?deletedBy=Leticia`, {
              method: "DELETE"
          });

          const data = await response.json();
          resultDiv.textContent = data.message || data.error;

          if (response.ok) {
              loadPersonList(); // Refresh list after deleting a person
          }
      } catch (error) {
          console.error("Erro ao deletar a pessoa:", error);
      }
  }

  // Function to load and display the person list
  async function loadPersonList() {
      try {
          const response = await fetch("http://localhost:3000/person");
          const people = await response.json();

          personList.innerHTML = ""; // Clear the list before repopulating

          people.forEach(person => {
              const listItem = document.createElement("li");
              listItem.textContent = `${person.name} - Salário: ${person.salary} - Aprovado: ${person.approved ? 'Sim' : 'Não'} - Trainee: ${person.trainee} - Início: ${new Date(person.dataInicio).toLocaleDateString()} - Fim: ${new Date(person.dataFim).toLocaleDateString()}`;

              // Add a delete button for each person
              const deleteButton = document.createElement("button");
              deleteButton.textContent = "Deletar";
              deleteButton.onclick = () => deletePerson(person.name);
              listItem.appendChild(deleteButton);

              personList.appendChild(listItem);
          });
      } catch (error) {
          console.error("Erro ao carregar a lista de pessoas:", error);
      }
  }

  // Event listeners
  personForm.addEventListener("submit", createOrUpdatePerson);
  document.getElementById("checkPersonBtn").addEventListener("click", checkPersonExists);

  // Load the person list on page load
  loadPersonList();
});
