.data
message:   .asciiz "Factorial: ;; "

.text
main:

# Print the message
    li      $v0,        4
    la      $a0,        message
    syscall 

# Calculate factorial of 5 (change this to calculate another number)
    li      $a0,        5
    jal     factorial

# Print the result
    move    $a0,        $v0
    li      $v0,        1
    syscall 

# Exit
    li      $v0,        10
    syscall 

factorial:
                                                # Base case: n = 0
    beq     $a0,        $zero,      base_case
                                                # Recursive case: n! = n * (n-1)!
    sub     $a0,        $a0,        1           # n-1
    jal     factorial                           # Call factorial(n-1)
    add     $a0,        $a0,        1           # Restore n value
    mul     $v0,        $v0,        $a0         # Multiply result by n
    jr      $ra                                 # Return

base_case:
    li      $v0,        1                       # 0! is 1
    jr      $ra                                 # Return
