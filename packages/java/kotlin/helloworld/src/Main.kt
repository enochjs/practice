import java.awt.Menu

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
fun main() {
//    val name = "Kotlin"
//
//    println("Hello, " + name + "!")
//
//    for (i in 1..5) {
//        println("i = $i")
//    }

//    val name = "Mary"
//    val age = 20
//
//    println("$name is $age years old")
    val a: Int = 1000
    val b: String = "log message"
    val c: Double = 3.14
    val d: Long = 100_000_000_000_000
    val e: Boolean = false
    val f: Char = '\n'

  // collections

  // Read only list
  val readOnlyShapes = listOf("triangle", "square", "circle")
  println(readOnlyShapes)

  // Mutable list with explicit type declaration
  val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
  shapes.add("pentagon")
  println(shapes)

  val shapesLocked: List<String> = shapes
  println(shapesLocked)


  // Read-only set
  val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
  // Mutable set with explicit type declaration
  val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
  val fruitLocked: Set<String> = fruit
  println(readOnlyFruit)
  // [apple, banana, cherry]

  // Read-only map
  val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
  println(readOnlyJuiceMenu)
  println("The value of apple juice is: ${readOnlyJuiceMenu["apple"]}")
  // {apple=100, kiwi=190, orange=100}

  // Mutable map with explicit type declaration
  val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
  println(juiceMenu)
  val juiceMenuLocked: Map<String, Int> = juiceMenu

  println("This map has ${readOnlyJuiceMenu.count()} key-value pairs")


  val greenNumbers = listOf(1, 4, 23)
  val redNumbers = listOf(17, 2)

  println("total count is ${greenNumbers.count() + redNumbers.count()}")

  val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
  val requested = "smtp"
//  val isSupported = SUPPORTED.contains(requested.uppercase())
  val isSupported = requested.uppercase() in SUPPORTED
  println("Support for $requested: $isSupported")


  val number2word = mapOf(1 to "one", 2 to "two", 3 to "three")
  val n = 2
  println("$n is spelt as '${number2word[n]}'")


  val button = "A"

  println(
    // Write your code here
    when(button) {
      "A" -> "Yes"
      "B" -> "No"
      "X" -> "Menu"
      "Y" -> "Nothing"
      else -> "There is no such button"
    }
  )

  var pizzaSlices = 0
  while (pizzaSlices <= 8) {
    pizzaSlices += 1;
    println("There's only $pizzaSlices slice/s of pizza :(\"")
  }

  pizzaSlices = 0
  do {
    pizzaSlices += 1;
    println("There's only $pizzaSlices slice/s of pizza :(\"")
  } while (pizzaSlices <= 8)

  for (i in 1 .. 100) {
    if (i % 15 == 0) {
      println("fizzBuzz")
    } else if (i % 3 == 0) {
      println("fizz")
    } else if (i % 5 == 0) {
      println("buzz")
    }

    println(
      when {
        i % 15 == 0 -> "fizzbuzz"
        i % 3 == 0 -> "fizz"
        i % 5 == 0 -> "buzz"
        else -> i.toString()
      }
    )
  }

  val words = listOf("dinosaur", "limousine", "magazine", "language")
  for(v in words) {
    if (v.startsWith("l")) {
      println(v)
    }
  }

  val area = circleArea(10)
  println("area $area")
  println("single area ${circleAreaSingle(10)}")

  println(intervalInSeconds(1, 20, 15))
  println(intervalInSeconds(minutes = 1, seconds = 25))
  println(intervalInSeconds(hours = 2))
  println(intervalInSeconds(minutes = 10))
  println(intervalInSeconds(hours = 1, seconds = 1))
  println(intervalInSeconds(1, 1))

  val timesInMinutes = listOf(2, 10, 15, 1)
  val min2sec = toSeconds("minute")
  val totalTimeInSeconds = timesInMinutes.map(min2sec).sum()
  println("Total time is $totalTimeInSeconds secs")


  val actions = listOf("title", "year", "author")
  val prefix = "https://example.com/book-info"
  val id = 5
  val urls = actions.map { item -> "${prefix}/${id}/${item}" }
  println(urls)

  repeatN(5, fun () {
    println("hello")
  })

  // tail lambdas
  repeatN(5) {
    println("Hello")
  }

  val emp = Employee("Mary", 20)
  println(emp)
  emp.salary += 10
  println(emp)

  val empGen = RandomEmployeeGenerator(10, 30)
  println(empGen.generateEmployee())
  println(empGen.generateEmployee())
  println(empGen.generateEmployee())
  empGen.minSalary = 50
  empGen.maxSalary = 100
  println(empGen.generateEmployee())

  fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
  }

  fun salaryById(id: Int) = employeeById(id)?.salary ?: 0

  println((1..5).sumOf { id -> salaryById(id) })
}

fun circleArea(r: Int): Double {
  // Write your code here
  return kotlin.math.PI * r * r
}

fun circleAreaSingle(r: Int) = kotlin.math.PI * r * r

fun intervalInSeconds(hours: Int = 0, minutes: Int = 0, seconds: Int = 0) =
  ((hours * 60) + minutes) * 60 + seconds

fun toSeconds(time: String): (Int) -> Int = when (time) {
  "hour" -> { value -> value * 60 * 60 }
  "minute" -> { value -> value * 60 }
  "second" -> { value -> value }
  else -> { value -> value }
}

fun repeatN(n: Int, action: () -> Unit) {
  for (i in 1..n) {
    action()
  }
}

data class Employee(val name: String, var salary: Int)

class RandomEmployeeGenerator(var minSalary: Int, var maxSalary: Int) {
  val names = listOf("John", "Mary", "Ann", "Paul", "Jack", "Elizabeth")
  fun generateEmployee() =
    Employee(names.random(),
      kotlin.random.Random.nextInt(from = minSalary, until = maxSalary))
}
