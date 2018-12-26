const name = document.querySelector('#firstName');
const surname = document.querySelector('#lastName');
const email = document.querySelector('#email');
const gender = document.querySelector('#gender');
const dateOfBirth = document.querySelector('#dateOfBirth');
const phoneNumber = document.querySelector('#phoneNumber');
const form = document.querySelector('.newStaff');
const loginForm = document.querySelector('.login-form');
const loginButton = document.querySelector('.login-button');
const secretID = document.querySelector('.secret-id');
const formContainer = document.querySelector('.container');
const profileInfo = document.querySelector('.profile-info');
const profile = document.querySelector('.profile');
const welcome = document.querySelector('.welcome-text');


//Staff schema
class Staff {
    constructor(name, surname, email, gender, dateOfBirth, phoneNumber) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.phoneNumber = phoneNumber;
        this.createdAt = new Date().toLocaleString();
        this._id = (function generator() {
            const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let result = '';
            for (let i = 32; i > 0; --i)
                result += chars[Math.floor(Math.random() * chars.length)];

            return `S+${result}`;
        }());

    };

    welcome() {
        return `Welcome ${this.name} ${this.surname}, check your email for your secret ID. Click <a class="login-link" onclick="redirect()">here</a> to continue`;
    };
};

//Check if array of staffs exist in localStorage and parses it, else it is empty []
let staffsArray = localStorage.getItem('staffs') ? JSON.parse(localStorage.getItem('staffs')) : [];
const database = JSON.parse(localStorage.getItem('staffs'));

form.addEventListener('submit', function (e) {
    e.preventDefault();

    let staff = new Staff(name.value, surname.value, email.value, gender.value, dateOfBirth.value, phoneNumber.value);
    const check = staffsArray.find(s => s.email === email.value);
    if (check) {
        welcome.classList.add('error');
        welcome.classList.remove('hidden');
        welcome.innerHTML = 'User already exists!'
        console.error('User already exists');
        return;
    }

    //Add a new staff to the array of staffs
    staffsArray.push(staff);
    //Add array of staff to localStorage(database)
    localStorage.setItem('staffs', JSON.stringify(staffsArray));

    welcome.classList.remove('hidden');
    welcome.innerHTML = staff.welcome();

    form.reset();

    let templateParams = {
        to: staff.email,
        subject: 'Welcome to Ter-Tech',
        html: `
        <h2>Welcome ${staff.name} ${staff.surname},</h2>
    
        <p>Your Secret ID is:  <strong>${staff._id}</strong><p/>
        
        <p>Do not share ID with anyone or else they gain access
        to your account</p>`
    }

    emailjs.send('default_service', 'template_GvFx6Edh', templateParams)
        .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);
        }, function (error) {
            console.log('FAILED...', error);
        });
});

//After succesful registration, this directs the user to the login page
function redirect() {
    formContainer.classList.add('hidden');
    welcome.classList.add('hidden');
    loginForm.classList.remove('hidden');
};

//Directs back to signup page
function signUp() {
    formContainer.classList.remove('hidden');
    welcome.classList.add('hidden');
    loginForm.classList.add('hidden');
}

loginButton.addEventListener('click',  function(e) {
    e.preventDefault();

    //check if staff exists in the database with the staff ID
    const result = staffsArray.find(c => c._id === secretID.value);
    if (!result || secretID.value === "") {
       welcome.classList.add('error');
       welcome.classList.remove('hidden');
       welcome.innerHTML = 'User does not exist!'
       console.error('User does not exist');
       return;
    };

    loginForm.classList.add('hidden');
    welcome.classList.add('hidden');
    profileInfo.classList.remove('hidden');

    profile.innerHTML = `<span class="profile-span">Name:</span> <p>${result.name}</p><br/> 
                            <span class="profile-span">Surname:</span> <p>${result.surname}</p><br/> 
                            <span class="profile-span">Email:</span> <p>${result.email}</p><br/> 
                            <span class="profile-span">Gender:</span> <p>${result.gender}</p><br/> 
                            <span class="profile-span">Date of Birth:</span> <p>${result.dateOfBirth}</p><br/> 
                            <span class="profile-span">Phone Number:</span> <p>${result.phoneNumber}</p>`;
});

