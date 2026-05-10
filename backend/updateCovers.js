require("dotenv").config();
const connectDB = require("./config/db");
const Book = require("./models/bookModel");

const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const A = "photo-1584697964403-1b3f6a4b5b9c";
const B = "photo-1524995997946-a1c2e315a42f";
const C = "photo-1512820790803-83ca734da794";
const D = "photo-1495446815901-a7297e633e8d";
const E = "photo-1507842217343-583bb7270b66";
const F = "photo-1476275466078-4007374efbbe";
const G = "photo-1532012197267-da84d127e765";
const H = "photo-1581093588401-22f66f6c1a5d";
const I = "photo-1581090700227-1e8c4a8d0f2c";
const J = "photo-1564981797816-1043664bf78d";
const K = "photo-1554475901-4538ddfbccc2";
const L = "photo-1519389950473-47ba0277781c";
const M = "photo-1555949963-aa79dcee981c";
const N = "photo-1518770660439-4636190af475";
const O = "photo-1526378722370-9d9c1a3c6f5d";
const P = "photo-1517433456452-f9633a875f6f";

const coverImages = {
  "978-9352530557": U(A),
  "978-8174506313": U(B),
  "978-8174506320": U(C),
  "978-8174506344": U(D),
  "978-8174506481": U(E),
  "978-8174506498": U(F),
  "978-8174506504": U(G),
  "978-8174506528": U(H),
  "978-8174506610": U(I),
  "978-8174506634": U(J),
  "978-8174506658": U(K),
  "978-8174506689": U(G),
  "978-9332518742": U(L),
  "978-9354600555": U(M),
  "978-0072465631": U(N),
  "978-1119800361": U(O),
  "978-1259096952": U(P),
  "978-0133387520": U(L),
  "978-0134610993": U(M),
};

const updateCovers = async () => {
  try {
    await connectDB();
    console.log("Connected to database.\n");
    let updated = 0;
    let notFound = 0;
    for (const [isbn, imageUrl] of Object.entries(coverImages)) {
      const book = await Book.findOneAndUpdate(
        { ISBN: isbn },
        { coverImage: imageUrl },
        { new: true }
      );
      if (book) {
        console.log(`  OK   "${book.title}" -> cover updated`);
        updated++;
      } else {
        console.log(`  MISS ISBN ${isbn} not found`);
        notFound++;
      }
    }
    console.log(`\nDone! Updated: ${updated} | Not found: ${notFound}`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating covers:", error.message);
    process.exit(1);
  }
};

updateCovers();
require("dotenv").config();
const connectDB = require("./config/db");
const Book = require("./models/bookModel");

// Unsplash crop params for HD-looking covers
const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

// User-provided Unsplash photo IDs
// Class 10 / 11 / 12 style covers (A-F)
const A = "photo-1584697964403-1b3f6a4b5b9c";
const B = "photo-1524995997946-a1c2e315a42f";
const C = "photo-1512820790803-83ca734da794";
const D = "photo-1495446815901-a7297e633e8d";
const E = "photo-1507842217343-583bb7270b66";
const F = "photo-1476275466078-4007374efbbe";
// Science / Math / Physics / Chemistry (G-K)
const G = "photo-1532012197267-da84d127e765";
const H = "photo-1581093588401-22f66f6c1a5d";
const I = "photo-1581090700227-1e8c4a8d0f2c";
const J = "photo-1564981797816-1043664bf78d";
const K = "photo-1554475901-4538ddfbccc2";
// Semester 5 / 6 (CS / BCA) (L-P)
const L = "photo-1519389950473-47ba0277781c";
const M = "photo-1555949963-aa79dcee981c";
const N = "photo-1518770660439-4636190af475";
const O = "photo-1526378722370-9d9c1a3c6f5d";
const P = "photo-1517433456452-f9633a875f6f";

const coverImages = {
  // CLASS 10
  "978-9352530557": U(A), // RD Sharma Math 10
  "978-8174506313": U(B), // NCERT Science 10
  "978-8174506320": U(C), // NCERT Social Science 10
  "978-8174506344": U(D), // NCERT English First Flight 10

  // CLASS 11
  "978-8174506481": U(E), // Physics P1 11
  "978-8174506498": U(F), // Physics P2 11
  "978-8174506504": U(G), // Chemistry P1 11
  "978-8174506528": U(H), // Math 11

  // CLASS 12
  "978-8174506610": U(I), // Physics P1 12
  "978-8174506634": U(J), // Chemistry P1 12
  "978-8174506658": U(K), // Math P1 12
  "978-8174506689": U(G), // Biology 12 (reuse science)

  // BCA SEM 4 / CS Fundamentals
  "978-9332518742": U(L), // Computer Networks
  "978-9354600555": U(M), // Software Engineering
  "978-0072465631": U(N), // DBMS
  "978-1119800361": U(O), // Operating Systems

  // BCA SEM 5 / 6 (Advanced CS)
  "978-1259096952": U(P), // Machine Learning
  "978-0133387520": U(L), // Cloud Computing (reuse CS)
  "978-0134610993": U(M), // AI Russell & Norvig (reuse CS)
};

const updateCovers = async () => {
  try {
    await connectDB();
    console.log("Connected to database.\n");

    let updated = 0;
    let notFound = 0;

    for (const [isbn, imageUrl] of Object.entries(coverImages)) {
      const book = await Book.findOneAndUpdate(
        { ISBN: isbn },
        { coverImage: imageUrl },
        { new: true }
      );

      if (book) {
        console.log(`  OK   "${book.title}" -> cover updated`);
        updated++;
      } else {
        console.log(`  MISS ISBN ${isbn} not found in database`);
        notFound++;
      }
    }

    console.log(`\nDone! Updated: ${updated} | Not found: ${notFound}`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating covers:", error.message);
    process.exit(1);
  }
};

updateCovers();

updateCovers();
