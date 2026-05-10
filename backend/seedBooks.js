require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Book = require("./models/bookModel");

const books = [
  // ─────────── CLASS 10 ───────────
  {
    title: "Mathematics - Class 10",
    author: "R.D. Sharma",
    category: "Class 10",
    ISBN: "978-9352530557",
    coverImage: "https://m.media-amazon.com/images/I/81YOFDnDCUL._SL300_.jpg",
    description: "Comprehensive mathematics textbook for CBSE Class 10 covering real numbers, polynomials, quadratic equations, arithmetic progressions, triangles, coordinate geometry, trigonometry, circles, areas, and statistics.",
    availability: true,
  },
  {
    title: "Science - Class 10 (NCERT)",
    author: "NCERT",
    category: "Class 10",
    ISBN: "978-8174506313",
    coverImage: "https://m.media-amazon.com/images/I/81yiGLQBTkL._SL300_.jpg",
    description: "NCERT Science textbook for Class 10 covering chemical reactions, acids-bases-salts, metals, carbon compounds, life processes, control and coordination, heredity, light, electricity, magnetic effects, and environment.",
    availability: true,
  },
  {
    title: "Social Science - Class 10 (NCERT)",
    author: "NCERT",
    category: "Class 10",
    ISBN: "978-8174506320",
    coverImage: "https://m.media-amazon.com/images/I/71lBsXJRaTL._SL300_.jpg",
    description: "NCERT Social Science textbook covering India and the Contemporary World (History), Contemporary India (Geography), Democratic Politics, and Understanding Economic Development.",
    availability: true,
  },
  {
    title: "English - First Flight (Class 10)",
    author: "NCERT",
    category: "Class 10",
    ISBN: "978-8174506344",
    coverImage: "https://m.media-amazon.com/images/I/71mOhpEWV+L._SL300_.jpg",
    description: "NCERT English textbook First Flight for Class 10 with prose and poetry including A Letter to God, Nelson Mandela, Two Stories about Flying, and more.",
    availability: true,
  },
  {
    title: "Hindi - Kshitij Part 2 (Class 10)",
    author: "NCERT",
    category: "Class 10",
    ISBN: "978-8174506351",
    coverImage: "https://m.media-amazon.com/images/I/71SYC6X5PIL._SL300_.jpg",
    description: "NCERT Hindi textbook Kshitij Bhag 2 for Class 10 covering poetry and prose by Surdas, Tulsidas, Dev, and other Hindi literary figures.",
    availability: true,
  },

  // ─────────── CLASS 11 ───────────
  {
    title: "Physics Part 1 - Class 11 (NCERT)",
    author: "NCERT",
    category: "Class 11",
    ISBN: "978-8174506481",
    coverImage: "https://m.media-amazon.com/images/I/71GiNb+JQjL._SL300_.jpg",
    description: "NCERT Physics Part 1 for Class 11 covering physical world, units & measurements, motion in a straight line, motion in a plane, laws of motion, work-energy-power, and system of particles.",
    availability: true,
  },
  {
    title: "Physics Part 2 - Class 11 (NCERT)",
    author: "NCERT",
    category: "Class 11",
    ISBN: "978-8174506498",
    coverImage: "https://m.media-amazon.com/images/I/71xGBLOJd1L._SL300_.jpg",
    description: "NCERT Physics Part 2 for Class 11 covering gravitation, mechanical properties of solids and fluids, thermodynamics, kinetic theory, oscillations, and waves.",
    availability: true,
  },
  {
    title: "Chemistry Part 1 - Class 11 (NCERT)",
    author: "NCERT",
    category: "Class 11",
    ISBN: "978-8174506504",
    coverImage: "https://m.media-amazon.com/images/I/71PqtthMdWL._SL300_.jpg",
    description: "NCERT Chemistry Part 1 for Class 11 covering structure of atom, classification of elements, chemical bonding, states of matter, thermodynamics, and equilibrium.",
    availability: true,
  },
  {
    title: "Mathematics - Class 11 (NCERT)",
    author: "NCERT",
    category: "Class 11",
    ISBN: "978-8174506528",
    coverImage: "https://m.media-amazon.com/images/I/71Qx2fDLURL._SL300_.jpg",
    description: "NCERT Mathematics for Class 11 covering sets, relations, trigonometric functions, complex numbers, linear inequalities, permutations, binomial theorem, sequences, straight lines, conic sections, limits, derivatives, statistics, and probability.",
    availability: true,
  },
  {
    title: "English - Hornbill (Class 11)",
    author: "NCERT",
    category: "Class 11",
    ISBN: "978-8174506535",
    coverImage: "https://m.media-amazon.com/images/I/71lx5hOuVeL._SL300_.jpg",
    description: "NCERT English core textbook Hornbill for Class 11 with chapters like The Portrait of a Lady, We're Not Afraid to Die, Discovering Tut, and Landscape of the Soul.",
    availability: true,
  },
  {
    title: "Accountancy Part 1 - Class 11 (NCERT)",
    author: "NCERT",
    category: "Class 11",
    ISBN: "978-8174506559",
    coverImage: "https://m.media-amazon.com/images/I/71Xq1V1yHTL._SL300_.jpg",
    description: "NCERT Accountancy textbook for Class 11 covering introduction to accounting, theory base of accounting, recording of transactions, trial balance, bank reconciliation statement, and depreciation.",
    availability: true,
  },

  // ─────────── CLASS 12 ───────────
  {
    title: "Physics Part 1 - Class 12 (NCERT)",
    author: "NCERT",
    category: "Class 12",
    ISBN: "978-8174506610",
    coverImage: "https://m.media-amazon.com/images/I/71KOOM+qURL._SL300_.jpg",
    description: "NCERT Physics Part 1 for Class 12 covering electric charges and fields, electrostatic potential, current electricity, moving charges, magnetism, electromagnetic induction, and alternating current.",
    availability: true,
  },
  {
    title: "Physics Part 2 - Class 12 (NCERT)",
    author: "NCERT",
    category: "Class 12",
    ISBN: "978-8174506627",
    coverImage: "https://m.media-amazon.com/images/I/71tueDN3ciL._SL300_.jpg",
    description: "NCERT Physics Part 2 for Class 12 covering electromagnetic waves, ray optics, wave optics, dual nature of radiation, atoms, nuclei, and semiconductor electronics.",
    availability: true,
  },
  {
    title: "Chemistry Part 1 - Class 12 (NCERT)",
    author: "NCERT",
    category: "Class 12",
    ISBN: "978-8174506634",
    coverImage: "https://m.media-amazon.com/images/I/71z8TrNBYKL._SL300_.jpg",
    description: "NCERT Chemistry Part 1 for Class 12 covering solid state, solutions, electrochemistry, chemical kinetics, surface chemistry, p-block elements, and d & f block elements.",
    availability: true,
  },
  {
    title: "Mathematics Part 1 - Class 12 (NCERT)",
    author: "NCERT",
    category: "Class 12",
    ISBN: "978-8174506658",
    coverImage: "https://m.media-amazon.com/images/I/71Y3EPfc4KL._SL300_.jpg",
    description: "NCERT Mathematics Part 1 for Class 12 covering relations and functions, inverse trigonometric functions, matrices, determinants, continuity, differentiability, and applications of derivatives.",
    availability: true,
  },
  {
    title: "Mathematics Part 2 - Class 12 (NCERT)",
    author: "NCERT",
    category: "Class 12",
    ISBN: "978-8174506665",
    coverImage: "https://m.media-amazon.com/images/I/71AjJN1BP1L._SL300_.jpg",
    description: "NCERT Mathematics Part 2 for Class 12 covering integrals, application of integrals, differential equations, vector algebra, three-dimensional geometry, linear programming, and probability.",
    availability: true,
  },
  {
    title: "English - Flamingo (Class 12)",
    author: "NCERT",
    category: "Class 12",
    ISBN: "978-8174506672",
    coverImage: "https://m.media-amazon.com/images/I/71Fz3KmIO+L._SL300_.jpg",
    description: "NCERT English core textbook Flamingo for Class 12 with The Last Lesson, Lost Spring, Deep Water, The Rattrap, Indigo, and Poets and Pancakes.",
    availability: true,
  },
  {
    title: "Biology - Class 12 (NCERT)",
    author: "NCERT",
    category: "Class 12",
    ISBN: "978-8174506689",
    coverImage: "https://m.media-amazon.com/images/I/71d952ij09L._SL300_.jpg",
    description: "NCERT Biology textbook for Class 12 covering reproduction, genetics, molecular biology, evolution, human health, biotechnology, ecology, biodiversity, and environmental issues.",
    availability: true,
  },

  // ─────────── BCA SEM 4 ───────────
  {
    title: "Operating System Concepts",
    author: "Abraham Silberschatz, Peter Galvin, Greg Gagne",
    category: "BCA Sem 4",
    ISBN: "978-1119800361",
    coverImage: "https://covers.openlibrary.org/b/isbn/9781119800361-M.jpg",
    description: "Comprehensive OS textbook covering process management, CPU scheduling, synchronization, deadlocks, memory management, virtual memory, storage, file systems, and protection & security.",
    availability: true,
  },
  {
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum, David J. Wetherall",
    category: "BCA Sem 4",
    ISBN: "978-9332518742",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780132126953-M.jpg",
    description: "Covers network architecture, physical layer, data link layer, MAC sublayer, network layer, transport layer, application layer, and network security fundamentals.",
    availability: true,
  },
  {
    title: "Software Engineering: A Practitioner's Approach",
    author: "Roger S. Pressman, Bruce R. Maxim",
    category: "BCA Sem 4",
    ISBN: "978-9354600555",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780078022128-M.jpg",
    description: "Software engineering concepts including SDLC models, requirements analysis, design engineering, testing strategies, project management, agile methods, and quality assurance.",
    availability: true,
  },
  {
    title: "Database Management Systems",
    author: "Raghu Ramakrishnan, Johannes Gehrke",
    category: "BCA Sem 4",
    ISBN: "978-0072465631",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780072465631-M.jpg",
    description: "Introduction to relational model, SQL, ER model, normalization, transaction management, concurrency control, query processing, and database design principles.",
    availability: true,
  },
  {
    title: "Discrete Mathematics and Its Applications",
    author: "Kenneth H. Rosen",
    category: "BCA Sem 4",
    ISBN: "978-1259676512",
    coverImage: "https://covers.openlibrary.org/b/isbn/9781259676512-M.jpg",
    description: "Covers logic, sets, functions, sequences, counting, relations, graph theory, trees, Boolean algebra, and computational models used in computer science.",
    availability: true,
  },

  // ─────────── BCA SEM 5 ───────────
  {
    title: "Web Technologies: HTML, CSS, JavaScript, PHP & MySQL",
    author: "Achyut S. Godbole, Atul Kahate",
    category: "BCA Sem 5",
    ISBN: "978-9354246340",
    coverImage: "https://m.media-amazon.com/images/I/81dp68XHORL._SL300_.jpg",
    description: "Complete web development guide covering HTML5, CSS3, JavaScript, PHP, MySQL, AJAX, jQuery, and responsive web design for building modern web applications.",
    availability: true,
  },
  {
    title: "Java: The Complete Reference",
    author: "Herbert Schildt",
    category: "BCA Sem 5",
    ISBN: "978-1260463422",
    coverImage: "https://covers.openlibrary.org/b/isbn/9781260463422-M.jpg",
    description: "Comprehensive Java reference covering OOP, data types, control statements, classes, inheritance, packages, interfaces, exception handling, multithreading, I/O, collections, JDBC, and JavaFX.",
    availability: true,
  },
  {
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    category: "BCA Sem 5",
    ISBN: "978-0134610993",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780134610993-M.jpg",
    description: "Foundational AI textbook covering intelligent agents, search algorithms, constraint satisfaction, game playing, knowledge representation, planning, machine learning, NLP, robotics, and ethics.",
    availability: true,
  },
  {
    title: "Computer Graphics",
    author: "Donald Hearn, M. Pauline Baker",
    category: "BCA Sem 5",
    ISBN: "978-0131202382",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780131202382-M.jpg",
    description: "Computer graphics fundamentals including line drawing algorithms, 2D/3D transformations, clipping, projections, visible surface detection, illumination models, and color theory.",
    availability: true,
  },
  {
    title: "Python Programming: Using Problem Solving Approach",
    author: "Reema Thareja",
    category: "BCA Sem 5",
    ISBN: "978-0199480173",
    coverImage: "https://m.media-amazon.com/images/I/71Fqsv2SYyL._SL300_.jpg",
    description: "Python programming covering data types, control flow, functions, modules, file handling, OOP, regular expressions, database programming, NumPy, Pandas, and Matplotlib.",
    availability: true,
  },

  // ─────────── BCA SEM 6 ───────────
  {
    title: "Cloud Computing: Concepts, Technology & Architecture",
    author: "Thomas Erl, Zaigham Mahmood, Ricardo Puttini",
    category: "BCA Sem 6",
    ISBN: "978-0133387520",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780133387520-M.jpg",
    description: "Covers cloud computing fundamentals, virtualization, cloud delivery models (IaaS, PaaS, SaaS), deployment models, cloud security, AWS/Azure concepts, and cloud architecture patterns.",
    availability: true,
  },
  {
    title: "Cyber Security Essentials",
    author: "James Graham, Richard Howard, Ryan Olson",
    category: "BCA Sem 6",
    ISBN: "978-1439851234",
    coverImage: "https://covers.openlibrary.org/b/isbn/9781439851234-M.jpg",
    description: "Covers information security, network security, cryptography, authentication, firewalls, intrusion detection, malware analysis, web application security, and ethical hacking basics.",
    availability: true,
  },
  {
    title: "Machine Learning",
    author: "Tom M. Mitchell",
    category: "BCA Sem 6",
    ISBN: "978-1259096952",
    coverImage: "https://covers.openlibrary.org/b/isbn/9780070428072-M.jpg",
    description: "Introduction to machine learning covering concept learning, decision trees, neural networks, Bayesian learning, instance-based learning, genetic algorithms, and reinforcement learning.",
    availability: true,
  },
  {
    title: "Mobile Application Development with Android",
    author: "Pradeep Kothari",
    category: "BCA Sem 6",
    ISBN: "978-9351199250",
    coverImage: "https://m.media-amazon.com/images/I/71J3+KMnEBL._SL300_.jpg",
    description: "Android app development covering activities, layouts, intents, fragments, SQLite, content providers, services, broadcast receivers, notifications, location services, and publishing apps.",
    availability: true,
  },
  {
    title: "Data Science and Big Data Analytics",
    author: "EMC Education Services",
    category: "BCA Sem 6",
    ISBN: "978-1118876138",
    coverImage: "https://covers.openlibrary.org/b/isbn/9781118876138-M.jpg",
    description: "Covers data analytics lifecycle, data analysis methods, advanced analytics (text, web, social media), big data technology landscape, Hadoop, MapReduce, and data visualization.",
    availability: true,
  },
  {
    title: "Full Stack Web Development with React & Node.js",
    author: "Vasan Subramanian",
    category: "BCA Sem 6",
    ISBN: "978-1484274002",
    coverImage: "https://covers.openlibrary.org/b/isbn/9781484274002-M.jpg",
    description: "MERN stack development covering React components, hooks, Redux, Node.js, Express.js, MongoDB, REST APIs, authentication, deployment, and building full-stack web applications.",
    availability: true,
  },
];

const seedBooks = async () => {
  try {
    await connectDB();
    console.log("Connected to database.\n");

    let added = 0;
    let skipped = 0;

    for (const book of books) {
      const exists = await Book.findOne({ ISBN: book.ISBN });
      if (exists) {
        console.log(`  SKIP  "${book.title}" (ISBN already exists)`);
        skipped++;
      } else {
        await Book.create(book);
        console.log(`  ADD   "${book.title}"`);
        added++;
      }
    }

    console.log(`\n✅ Done! Added: ${added} | Skipped: ${skipped} | Total in script: ${books.length}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding books:", error.message);
    process.exit(1);
  }
};

seedBooks();
