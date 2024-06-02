# DNS Manager

DNS Manager With Authentication And all Validations

### How To Install packages in server folder

#### Open terminal of your editor then type

```
cd server
```

#### Then input this script

```
npm install aws-sdk@latest bcryptjs@latest body-parser@latest cors@latest dotenv@latest express@latest express-validator@latest jsonwebtoken@latest mongoose@latest nodemon@latest --save
```

### How To Install packages in client folder

#### Open terminal of your editor then type

```
cd client
```

#### Then input this script

```
npm install @fortawesome/fontawesome-free@latest @fortawesome/free-solid-svg-icons@latest @fortawesome/react-fontawesome@latest @testing-library/jest-dom@latest @testing-library/react@latest @testing-library/user-event@latest axios@latest bootstrap@latest chart.js@latest file-saver@latest react@latest react-bootstrap@latest react-dom@latest react-router-dom@latest react-scripts@latest react-toastify@latest react-tooltip@latest web-vitals@latest xlsx@latest --save
```

#### By This JSON you can insert Data into the "dnstypes" Table

```
[
  { "type": "A", "description": "Address Record" },
  { "type": "AAAA", "description": "IPv6 Address Record" },
  { "type": "CNAME", "description": "Canonical Name Record" },
  { "type": "MX", "description": "Mail Exchange Record" },
  { "type": "NS", "description": "Name Server Record" },
  { "type": "PTR", "description": "Pointer Record" },
  { "type": "SOA", "description": "Start of Authority Record" },
  { "type": "SRV", "description": "Service Record" },
  { "type": "TXT", "description": "Text Record" },
  { "type": "DNSSEC", "description": "DNSSEC" }
]
```

## Mongo DB URL

mongodb+srv://jatinbundel:Jatin123@cluster0.ug5kxjw.mongodb.net/dnsManager?retryWrites=true&w=majority&appName=Cluster0

## Credentials To Login Are:

#### First Account

Email: jatin.bundel12@gmail.com\
Password: Jatin@123

#### Second Account

Email: kirti.bundel29@gmail.com\
Password: Kirti@123

## Screenshots

#### Login Screen

<ul>
When You are logging in, it will check your email and password accordingly and then login to your account with the same email and password as you entered in the form below.</ul>

![My_Image](./DNS-Manager-Screenshots/Login_Page.png)

#### Registration Screen

<ul>
If you want to create a new Login Account.
</ul>

![My_Image](./DNS-Manager-Screenshots/Registration_Page.png)

#### Records Screen

<ul>
<li>
It will Shows the logged in user's added or edited data from the database.
</li>
<li>
Default Records Per Page is 10, you can select 10, 20, 50 and 100.
</li>
<li>
Also Has Page Navigation System.
</li>
<li>
There is Download Excel File From Which You can Download the Excel Document.
</li>
</ul>

![My_Image](./DNS-Manager-Screenshots/Table.png)

#### Add Records Screen

<ul>
Records can be Added from the Form.
</ul>

![My_Image](./DNS-Manager-Screenshots/Add_Record.png)

#### Edit Record Screen

<ul>
Records can be Edited from the Form.
</ul>

![My_Image](./DNS-Manager-Screenshots/Edit_Records.png)

#### Searching Feature

<ul>
We can Search for anything for any fields. For example I type 'test.com' it will search from any feilds like 'Type', 'Name', 'Value' and 'TTL'.
</ul>

![My_Image](./DNS-Manager-Screenshots/searching.png)

#### Sorting Feature

<ul>
We can Sort the data as shown in Screenshot given below, for all fields.
</ul>

![My_Image](./DNS-Manager-Screenshots/Sorting.png)

## License

[MIT](https://choosealicense.com/licenses/mit/)
