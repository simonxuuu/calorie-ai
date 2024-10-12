"about page"

// Function to create and display the "About Us" page for the team
function createAboutPage() {
    // Create the container div
    const aboutContainer = document.createElement('div');
    aboutContainer.style.padding = '20px';
    aboutContainer.style.fontFamily = "Montserrat", sans-serif;
    aboutContainer.style.backgroundColor = white;
    aboutContainer.style.borderRadius = '10px';
    aboutContainer.style.width = '80%';
    aboutContainer.style.margin = '0 auto';

    // Create and set the title
    const title = document.createElement('h1');
    title.textContent = 'About Our Team';
    title.style.color = '#333';
    aboutContainer.appendChild(title);

    // Create the description paragraph
    const description = document.createElement('p');
    description.textContent = 'We are a dedicated team of developers, nutritionists, and fitness enthusiasts working together to bring you the best calorie tracker website. Our goal is to make it easier for people to maintain a healthy lifestyle by tracking their daily caloric intake and providing helpful insights.';
    description.style.color = '#555';
    aboutContainer.appendChild(description);

    // Create the team members list
    const teamTitle = document.createElement('h2');
    teamTitle.textContent = 'Meet Our Team:';
    teamTitle.style.color = '#333';
    aboutContainer.appendChild(teamTitle);

    // Team members data
    const teamMembers = [
        { name: 'Simon Xu', role: 'Developer' },
        { name: 'Andrew Miller', role: 'Developer' },
        { name: 'Jerry Fu', role: 'Developer' },
    ];

    // Create a list for team members
    const teamList = document.createElement('ul');
    teamList.style.listStyleType = 'none';
    teamList.style.padding = '0';

    // Add each team member to the list
    teamMembers.forEach(member => {
        const listItem = document.createElement('li');
        listItem.textContent = `${member.name} - ${member.role}`;
        listItem.style.margin = '10px 0';
        listItem.style.color = '#444';
        listItem.style.fontSize = '18px';
        teamList.appendChild(listItem);
    });

    aboutContainer.appendChild(teamList);

    // Create and append the "Show More" button
    const showMoreButton = document.createElement('button');
    showMoreButton.textContent = 'Show More About Us';
    showMoreButton.style.backgroundColor = '#007bff';
    showMoreButton.style.color = '#fff';
    showMoreButton.style.border = 'none';
    showMoreButton.style.padding = '10px 20px';
    showMoreButton.style.cursor = 'pointer';
    showMoreButton.style.borderRadius = '5px';
    showMoreButton.style.marginTop = '20px';
    showMoreButton.addEventListener('click', toggleMoreInfo);

    aboutContainer.appendChild(showMoreButton);

    // Additional info (hidden by default)
    const moreInfo = document.createElement('p');
    moreInfo.textContent = 'We are committed to making our calorie tracker user-friendly and packed with features that help users track their meals, set goals, and stay motivated. Our team is constantly working to improve the site with feedback from our users.';
    moreInfo.style.display = 'none'; // Initially hidden
    moreInfo.style.color = '#666';
    moreInfo.style.marginTop = '20px';
    aboutContainer.appendChild(moreInfo);

    // Append the container to the body
    document.body.appendChild(aboutContainer);

    // Toggle visibility of more info
    function toggleMoreInfo() {
        if (moreInfo.style.display === 'none') {
            moreInfo.style.display = 'block';
            showMoreButton.textContent = 'Show Less About Us';
        } else {
            moreInfo.style.display = 'none';
            showMoreButton.textContent = 'Show More About Us';
        }
    }
}

// Call the function to create and display the about page
createAboutPage();