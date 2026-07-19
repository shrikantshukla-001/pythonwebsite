// ============================================
// CODEROOM PYTHON ACADEMY — DATA
// ============================================

const YOUTUBE_CHANNEL = "https://www.youtube.com/@CodeRoomS";

// ---------- GENERATE TOPIC ----------
function generateTopic(id, title, section, order) {
  const safeId = id.replace(/-/g, '_');
  return {
    id, title, section, order,
    content: {
      simpleExplanation: `${title} is a fundamental concept in Python programming. It allows developers to write efficient and readable code.`,
      detailedExplanation: `Understanding ${title} is crucial for mastering Python. This topic covers the core mechanics, how it operates under the hood, and why it is preferred over alternative approaches in various scenarios. When working with Python, ${title.toLowerCase()} provides an elegant way to handle specific logic flows and memory structures. Developers frequently rely on this to build robust applications, ranging from simple scripts to complex web backends and data science pipelines. Mastery of this concept will significantly reduce your debugging time and improve your system architecture.`,
      realLifeExample: `Think of ${title} like organizing a bookshelf. If you categorize books properly, finding one takes seconds. If you pile them randomly, it takes hours. ${title} acts as the organizational system for your logic.`,
      syntax: `# Basic syntax for ${title}\nexample_${safeId} = "Hello, Python!"\nprint(example_${safeId})`,
      codeExamples: [
        {
          title: `Basic Usage of ${title}`,
          code: `def demonstrate_${safeId}():\n    # Initialize concept\n    result = "${title} in action"\n    return result\n\nprint(demonstrate_${safeId}())`,
          output: `${title} in action`
        },
        {
          title: `Advanced Application`,
          code: `items = [1, 2, 3]\n# Applying ${title} logic\nprocessed = [i * 2 for i in items]\nprint(f"Processed: {processed}")`,
          output: `Processed: [2, 4, 6]`
        },
        {
          title: `Error Handling Example`,
          code: `try:\n    # Risky ${title} operation\n    value = 10 / 2\n    print(f"Success: {value}")\nexcept Exception as e:\n    print(f"Error occurred: {e}")`,
          output: `Success: 5.0`
        }
      ],
      keyPoints: [
        `${title} improves code maintainability.`,
        `It is an essential part of the Python standard library.`,
        `Performance can be optimized by using it correctly.`,
        `Always consider edge cases when implementing this.`,
        `It works seamlessly with other Python data structures.`
      ],
      commonMistakes: [
        `Forgetting to initialize variables before using ${title}.`,
        `Misunderstanding the scope and mutability rules.`,
        `Overcomplicating the logic instead of using built-in Python features.`
      ],
      bestPractices: [
        `Follow PEP 8 naming conventions.`,
        `Write unit tests to verify the behavior of ${title}.`,
        `Keep functions related to this concept small and focused.`,
        `Use clear and descriptive variable names.`
      ],
      interviewQuestions: [
        { question: `What is ${title} and why is it used?`, answer: `${title} is a core Python feature used to handle specific operations efficiently. It is used to write clean, Pythonic code.` },
        { question: `How does ${title} compare to other languages?`, answer: `Python's implementation is often more readable and requires less boilerplate code compared to languages like Java or C++.` },
        { question: `Can you explain a common pitfall with ${title}?`, answer: `A common pitfall is ignoring memory usage, which can lead to performance bottlenecks if used inside large loops.` },
        { question: `How do you optimize ${title}?`, answer: `By using generator expressions or built-in functions instead of manual loops.` },
        { question: `Is ${title} thread-safe?`, answer: `It depends on the specific implementation, but generally, Python's GIL provides some safety, though explicit locks may be needed for complex state sharing.` }
      ],
      practiceExercises: [
        `Write a program that uses ${title} to process a list of 100 integers.`,
        `Create a function that accepts user input and applies ${title} logic to validate it.`,
        `Refactor a simple script to use ${title} for better performance.`
      ],
      assignment: `Build a mini-application (e.g., a CLI tool) that heavily relies on ${title}. Ensure it handles invalid inputs gracefully and prints the final state clearly.`,
      summary: `${title} is a powerful tool in the Python ecosystem. Mastering it allows you to write clean, efficient, and professional-grade code.`
    }
  };
}

// ---------- COURSE DATA ----------
const courseData = [
  generateTopic("introduction","Introduction to Python","Basics",1),
  generateTopic("installing-python","Installing Python","Basics",2),
  generateTopic("vscode-setup","VS Code Setup","Basics",3),
  generateTopic("python-syntax","Python Syntax","Basics",4),
  generateTopic("comments","Comments","Basics",5),
  generateTopic("print-function","Print Function","Basics",6),
  generateTopic("variables","Variables","Basics",7),
  generateTopic("data-types","Data Types","Basics",8),
  generateTopic("type-casting","Type Casting","Basics",9),
  generateTopic("input-function","Input Function","Basics",10),
  generateTopic("operators","Operators","Basics",11),
  generateTopic("conditional-statements","Conditional Statements","Control Flow",12),
  generateTopic("loops","Loops","Control Flow",13),
  generateTopic("break-continue-pass","Break, Continue, Pass","Control Flow",14),
  generateTopic("strings","Strings","Strings & Data Structures",15),
  generateTopic("string-methods","String Methods","Strings & Data Structures",16),
  generateTopic("lists","Lists","Strings & Data Structures",17),
  generateTopic("tuples","Tuples","Strings & Data Structures",18),
  generateTopic("sets","Sets","Strings & Data Structures",19),
  generateTopic("dictionaries","Dictionaries","Strings & Data Structures",20),
  generateTopic("functions","Functions","Functions & Modules",21),
  generateTopic("lambda","Lambda Functions","Functions & Modules",22),
  generateTopic("recursion","Recursion","Functions & Modules",23),
  generateTopic("modules","Modules","Functions & Modules",24),
  generateTopic("packages","Packages","Functions & Modules",25),
  generateTopic("exception-handling","Exception Handling","Error & File Handling",26),
  generateTopic("file-handling","File Handling","Error & File Handling",27),
  generateTopic("os-module","OS Module","Standard Library",28),
  generateTopic("math-module","Math Module","Standard Library",29),
  generateTopic("random-module","Random Module","Standard Library",30),
  generateTopic("datetime-module","Datetime Module","Standard Library",31),
  generateTopic("regular-expressions","Regular Expressions","Standard Library",32),
  generateTopic("oop-introduction","OOP Introduction","OOP",33),
  generateTopic("classes","Classes","OOP",34),
  generateTopic("objects","Objects","OOP",35),
  generateTopic("constructors","Constructors","OOP",36),
  generateTopic("inheritance","Inheritance","OOP",37),
  generateTopic("polymorphism","Polymorphism","OOP",38),
  generateTopic("encapsulation","Encapsulation","OOP",39),
  generateTopic("abstraction","Abstraction","OOP",40),
  generateTopic("mini-projects","Mini Projects","Projects",41),
  generateTopic("final-revision","Final Revision","Projects",42)
];

// Override introduction topic
const intro = courseData.find(t => t.id === 'introduction');
if (intro) {
  intro.content.simpleExplanation = "Python is a high-level, interpreted programming language known for its clear syntax and readability.";
  intro.content.detailedExplanation = "Created by Guido van Rossum and first released in 1991, Python's design philosophy emphasizes code readability with its notable use of significant indentation. Its language constructs and object-oriented approach aim to help programmers write clear, logical code for small and large-scale projects. Python is dynamically typed and garbage-collected, supporting multiple programming paradigms, including structured, object-oriented, and functional programming.";
  intro.content.realLifeExample = "Think of Python as plain English. Instead of writing complex symbols to tell someone how to bake a cake, you just write clear, step-by-step instructions. Python reads almost like a recipe.";
  intro.content.syntax = "# This is how you print something in Python\nprint('Welcome to CodeRoom Python Academy!')";
}

// ---------- QUIZ DATA ----------
const quizData = {};
courseData.forEach(topic => {
  quizData[topic.id] = [
    { id:1, question:`What is the primary use of ${topic.title}?`, options:["To confuse developers","To manage memory manually","To structure and execute logic efficiently","To compile code to machine language"], correctIndex:2, explanation:`${topic.title} is a core feature used to build clean and efficient logic in Python.` },
    { id:2, question:`Which of the following is considered a best practice when using ${topic.title}?`, options:["Using single-letter variables everywhere","Writing complex nested loops","Following PEP 8 guidelines","Ignoring error handling"], correctIndex:2, explanation:"Following PEP 8 guidelines ensures your code remains readable and Pythonic." },
    { id:3, question:`How does Python handle errors related to ${topic.title}?`, options:["It ignores them","It raises an Exception at runtime","It crashes the entire OS","It auto-corrects the code"], correctIndex:1, explanation:"Python is an interpreted language and will raise runtime exceptions when it encounters errors." },
    { id:4, question:`What will be the output of an improperly implemented ${topic.title}?`, options:["SyntaxError or logic bugs","Faster execution","Automatic code refactoring","Nothing, it just works"], correctIndex:0, explanation:"Improper implementation usually leads to SyntaxErrors, TypeErrors, or subtle logic bugs." },
    { id:5, question:`Is ${topic.title} specific only to Python?`, options:["Yes, no other language has it","No, many languages have similar concepts","It was removed in Python 3","It is only available in Python 2"], correctIndex:1, explanation:"Most high-level programming languages share fundamental concepts with Python, though syntax differs." },
    { id:6, question:`Which built-in function is often used alongside ${topic.title}?`, options:["print()","crash()","explode()","destroy()"], correctIndex:0, explanation:"print() is universally used for debugging and displaying output." },
    { id:7, question:`What is a common mistake beginners make with ${topic.title}?`, options:["Writing too much documentation","Testing code too often","Misunderstanding scope and syntax","Optimizing too early"], correctIndex:2, explanation:"Beginners often struggle with Python's indentation, scope rules, and specific syntax quirks." },
    { id:8, question:`Can ${topic.title} be used in web development?`, options:["No, it's only for data science","Yes, especially with frameworks like Django and FastAPI","Only in frontend development","Only in game development"], correctIndex:1, explanation:"Python is heavily used in backend web development using frameworks like Django, Flask, and FastAPI." },
    { id:9, question:`How do you comment out code related to ${topic.title}?`, options:["// comment","<!-- comment -->","/* comment */","# comment"], correctIndex:3, explanation:"Python uses the # symbol for single-line comments." },
    { id:10, question:`Why should you master ${topic.title}?`, options:["To pass a single exam","To write scalable, maintainable Python applications","Because it is required to use HTML","To make the code run slower"], correctIndex:1, explanation:"Mastering core Python concepts allows you to build robust, scalable applications." }
  ];
});

// Custom overrides for introduction quiz
quizData['introduction'][0] = { id:1, question:"Who created the Python programming language?", options:["Dennis Ritchie","James Gosling","Guido van Rossum","Bjarne Stroustrup"], correctIndex:2, explanation:"Python was created by Guido van Rossum and first released in 1991." };
quizData['introduction'][1] = { id:2, question:"Which of the following statements about Python is true?", options:["Python is a compiled language","Python requires manual memory management","Python uses significant indentation","Python does not support OOP"], correctIndex:2, explanation:"Python uses indentation to define code blocks, unlike languages that use curly braces." };

// ---------- LECTURES ----------
const lectures = [
  { id:"intro", title:"Lecture 1 – Introduction to Python", description:"What is Python, why learn it, and how it works. Overview of Python's history and applications.", duration:"15:30", videoId:"MqoOQrqvJJ4", watchUrl:"https://youtu.be/MqoOQrqvJJ4?si=ljL7ZbVHj0VBFlWz" }
];

// ---------- RESOURCES ----------
const resources = [
  {
    category: "📥 Downloads",
    items: [
      { name:"Python Cheat Sheet (PDF)", desc:"Complete Python syntax reference — beginner to advanced.", url:"https://perso.limsi.fr/pointal/_media/python:cours:mementopython3-english.pdf", icon:"📄" },
      { name:"OOP Cheat Sheet (PDF)", desc:"Classes, inheritance, polymorphism & more in one page.", url:"https://media.cheatography.com/storage/thumb/haishi_python-oop.750.jpg", icon:"🧬" }
    ]
  },
  {
    category: "🌐 Practice Platforms",
    items: [
      { name:"HackerRank Python", desc:"Solve Python challenges from easy to hard. Great for interview prep.", url:"https://www.hackerrank.com/domains/python", icon:"💻" },
      { name:"W3Schools Python", desc:"Interactive Python tutorials with live code editors.", url:"https://www.w3schools.com/python/", icon:"🏫" },
      { name:"LeetCode Python", desc:"Practice DSA problems in Python. Essential for placement.", url:"https://leetcode.com/problemset/all/?difficulty=EASY&page=1&topicSlugs=python", icon:"🧩" }
    ]
  },
  {
    category: "📚 Official Documentation",
    items: [
      { name:"Python 3 Docs", desc:"The official Python 3 documentation — always up to date.", url:"https://docs.python.org/3/", icon:"📘" },
      { name:"Python Standard Library", desc:"All built-in modules and functions reference.", url:"https://docs.python.org/3/library/index.html", icon:"📗" }
    ]
  },
  {
    category: "🎥 Video Resources",
    items: [
      { name:"CodeRoom YouTube Channel", desc:"Free Python lectures by Shrikant Shukla — same as this course!", url:YOUTUBE_CHANNEL, icon:"▶️" },
      { name:"Python in One Video", desc:"90-minute crash course for absolute beginners.", url:"https://www.youtube.com/watch?v=_uQrJ0TkZlc", icon:"🎬" }
    ]
  }
];

// ---------- FAQ ----------
const faqs = [
  { q:"Is this course completely free?", a:"Yes! CodeRoom Python Academy is 100% free. All topics, quizzes, and video lectures are available without any payment or subscription." },
  { q:"Who is this course designed for?", a:"This course is designed for absolute beginners with zero programming experience, as well as students who want to strengthen their Python fundamentals from scratch." },
  { q:"How long will it take to complete?", a:"At a pace of 1-2 hours per day, you can complete the full curriculum in approximately 4-6 weeks. Each topic is self-paced, so you can go faster or slower as needed." },
  { q:"Do I need any software installed?", a:"You need Python 3.x installed on your computer and VS Code as your editor. Both are free. The course includes dedicated topics on installation and setup." },
  { q:"Will I get a certificate after completing?", a:"We don't issue formal certificates yet, but you will build real Python projects and a portfolio that demonstrates your skills — far more valuable than a certificate." },
  { q:"What makes CodeRoom different from other courses?", a:"CodeRoom combines reading-based learning (this platform), live video lectures on YouTube, and hands-on quizzes — a triple approach that ensures deep retention. Plus, it's guided by an active EdTech creator." },
  { q:"Can I skip topics I already know?", a:"Absolutely! Each topic is independent. You can start from any section and jump around based on your current level." },
  { q:"How are the quizzes graded?", a:"Each quiz has 10 multiple-choice questions. Your score is shown immediately after completion, and your progress is saved locally in your browser." }
];
