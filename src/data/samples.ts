import { LanguageOption, SampleCodeItem } from '../types/exorcist';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { id: 'python', name: 'Python', extension: '.py', mime: 'text/x-python' },
  { id: 'javascript', name: 'JavaScript', extension: '.js', mime: 'text/javascript' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts', mime: 'application/typescript' },
  { id: 'java', name: 'Java', extension: '.java', mime: 'text/x-java-source' },
  { id: 'cpp', name: 'C++', extension: '.cpp', mime: 'text/x-c++src' },
  { id: 'c', name: 'C', extension: '.c', mime: 'text/x-csrc' },
  { id: 'sql', name: 'SQL', extension: '.sql', mime: 'text/x-sql' },
  { id: 'html', name: 'HTML', extension: '.html', mime: 'text/html' },
  { id: 'css', name: 'CSS', extension: '.css', mime: 'text/css' },
];

export const CODE_SAMPLES: SampleCodeItem[] = [
  {
    id: 'python-haunted-cart',
    title: 'Haunted Shopping Cart & Stats',
    language: 'python',
    fileName: 'checkout_calculator.py',
    description: 'Python script with mutable default arguments, off-by-one loops, zero division, and unhandled file handle leak.',
    knownHauntingsCount: 4,
    code: `import json

def add_item_to_cart(item, price, cart=[]):
    """Adds item to shopping cart with prices."""
    cart.append({"name": item, "price": price})
    return cart

def calculate_average_discount(discounts):
    """Calculates average discount across user vouchers."""
    # Haunting: Division by zero when discounts list is empty
    total = sum(discounts)
    return total / len(discounts)

def print_receipt(items):
    """Prints item summary with index."""
    # Haunting: Off-by-one index error causing IndexError
    for i in range(len(items) + 1):
        print(f"Item {i + 1}: {items[i]['name']} - \${items[i]['price']}")

def save_log(entry, path="cart_events.log"):
    """Saves transaction event to disk."""
    # Haunting: Resource leak, unclosed file handle
    f = open(path, "a")
    f.write(json.dumps(entry) + "\\n")
    return True

if __name__ == "__main__":
    cart1 = add_item_to_cart("Spellbook", 49.99)
    cart2 = add_item_to_cart("Cauldron", 120.00)
    print("Cart 2 contents:", cart2)
    print_receipt(cart1)
    calculate_average_discount([])
`,
    demoAnalysis: {
      language: 'python',
      summary: 'Detected 4 critical and high severity hauntings including persistent mutable default argument state, ZeroDivisionError on empty vouchers, an IndexError in receipt printing, and an unclosed file descriptor leak.',
      findings: [
        {
          id: 'haunting-py-1',
          title: 'Mutable Default Argument Cart Accumulation',
          line: 3,
          category: 'logic',
          severity: 'high',
          explanation: 'In Python, default parameter values are evaluated once when the function is defined, not each time it is called. Using `cart=[]` means all invocations share the same list instance across different callers, leaking state.',
          suggested_fix: 'Use `cart=None` as the default and initialize a new list `cart = []` inside the function if cart is None.',
          original_snippet: 'def add_item_to_cart(item, price, cart=[]):',
          corrected_snippet: 'def add_item_to_cart(item, price, cart=None):\n    if cart is None:\n        cart = []',
        },
        {
          id: 'haunting-py-2',
          title: 'Unchecked Division by Zero on Empty Collection',
          line: 11,
          category: 'edge_case',
          severity: 'critical',
          explanation: 'If `discounts` is empty, `len(discounts)` evaluates to 0, raising an unhandled `ZeroDivisionError` that crashes the transaction pipeline.',
          suggested_fix: 'Guard with a check `if not discounts: return 0.0` before performing division.',
          original_snippet: '    total = sum(discounts)\n    return total / len(discounts)',
          corrected_snippet: '    if not discounts:\n        return 0.0\n    return sum(discounts) / len(discounts)',
        },
        {
          id: 'haunting-py-3',
          title: 'Off-By-One Range Bound IndexError',
          line: 16,
          category: 'runtime',
          severity: 'critical',
          explanation: '`range(len(items) + 1)` iterates up to `len(items)`, but valid 0-based list indices only reach `len(items) - 1`. When `i == len(items)`, `items[i]` raises an immediate `IndexError`.',
          suggested_fix: 'Iterate directly over items with `enumerate(items)` or use `range(len(items))`.',
          original_snippet: '    for i in range(len(items) + 1):\n        print(f"Item {i + 1}: {items[i][\'name\']} - ${items[i][\'price\'] }")',
          corrected_snippet: '    for i, item in enumerate(items):\n        print(f"Item {i + 1}: {item[\'name\']} - ${item[\'price\'] }")',
        },
        {
          id: 'haunting-py-4',
          title: 'Resource Leak: Unclosed File Handle',
          line: 22,
          category: 'runtime',
          severity: 'medium',
          explanation: 'Opening a file with raw `open()` without a `with` context manager leaves file descriptors open, causing descriptor exhaustion or uncommitted disk buffers if an error occurs.',
          suggested_fix: 'Wrap the file write in a standard `with open(...) as f:` context manager.',
          original_snippet: '    f = open(path, "a")\n    f.write(json.dumps(entry) + "\\n")\n    return True',
          corrected_snippet: '    with open(path, "a") as f:\n        f.write(json.dumps(entry) + "\\n")\n    return True',
        },
      ],
      corrected_code: `import json

def add_item_to_cart(item, price, cart=None):
    """Adds item to shopping cart with prices."""
    if cart is None:
        cart = []
    cart.append({"name": item, "price": price})
    return cart

def calculate_average_discount(discounts):
    """Calculates average discount across user vouchers."""
    if not discounts:
        return 0.0
    return sum(discounts) / len(discounts)

def print_receipt(items):
    """Prints item summary with index."""
    for i, item in enumerate(items):
        print(f"Item {i + 1}: {item['name']} - \${item['price']}")

def save_log(entry, path="cart_events.log"):
    """Saves transaction event to disk."""
    with open(path, "a") as f:
        f.write(json.dumps(entry) + "\\n")
    return True

if __name__ == "__main__":
    cart1 = add_item_to_cart("Spellbook", 49.99)
    cart2 = add_item_to_cart("Cauldron", 120.00)
    print("Cart 2 contents:", cart2)
    print_receipt(cart1)
    print("Avg discount:", calculate_average_discount([]))
`,
      applied_fixes: [
        'Mutable Default Argument Cart Accumulation',
        'Unchecked Division by Zero on Empty Collection',
        'Off-By-One Range Bound IndexError',
        'Resource Leak: Unclosed File Handle',
      ],
      unresolved_issues: [],
      analyzedAt: new Date().toISOString(),
    },
  },
  {
    id: 'js-spooky-auth',
    title: 'Spooky Async Auth & User Profile',
    language: 'javascript',
    fileName: 'user_service.js',
    description: 'JavaScript API handler with unhandled promise rejections, type coercion bugs, and null pointer dereference.',
    knownHauntingsCount: 3,
    code: `// Spooky User Authentication & Profile Handler
async function fetchUserProfile(userId) {
  // Haunting 1: Loose equality allows '0' and false type coercion
  if (userId == null || userId == 0) {
    throw new Error("Invalid user ID supplied");
  }

  // Haunting 2: Missing await on fetch and no try/catch for unhandled rejection
  const response = fetch(\`/api/users/\${userId}\`);
  const data = response.json();

  // Haunting 3: Blind property chaining leading to Cannot read properties of undefined
  const primaryRole = data.roles[0].name;
  const displayName = data.profile.name.toUpperCase();

  return {
    id: userId,
    role: primaryRole,
    name: displayName,
    token: generateToken(userId)
  };
}

function generateToken(id) {
  return "token_" + Math.random().toString(36).substring(2);
}
`,
    demoAnalysis: {
      language: 'javascript',
      summary: 'Exorcised 3 critical JavaScript hauntings: missing asynchronous awaits causing promise object access, potential null reference exceptions on nested role arrays, and unsafe numeric falsy coercion.',
      findings: [
        {
          id: 'haunting-js-1',
          title: 'Missing await on asynchronous fetch & json resolution',
          line: 9,
          category: 'runtime',
          severity: 'critical',
          explanation: '`fetch` and `response.json()` return Promises. Without `await`, `response` and `data` are unresolved Promise instances rather than payload data, causing `data.roles` to fail immediately.',
          suggested_fix: 'Add `await` before `fetch(...)` and `await response.json()`, and verify `response.ok`.',
          original_snippet: '  const response = fetch(`/api/users/${userId}`);\n  const data = response.json();',
          corrected_snippet: '  const response = await fetch(`/api/users/${userId}`);\n  if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch user`);\n  const data = await response.json();',
        },
        {
          id: 'haunting-js-2',
          title: 'Unsafe nested property access without null checks',
          line: 13,
          category: 'runtime',
          severity: 'high',
          explanation: 'Directly dereferencing `data.roles[0].name` and `data.profile.name` throws `TypeError: Cannot read properties of undefined` if roles is empty or profile is absent.',
          suggested_fix: 'Use optional chaining (`?.`) with sensible fallback values.',
          original_snippet: '  const primaryRole = data.roles[0].name;\n  const displayName = data.profile.name.toUpperCase();',
          corrected_snippet: '  const primaryRole = data.roles?.[0]?.name ?? "guest";\n  const displayName = (data.profile?.name ?? "Anonymous").toUpperCase();',
        },
        {
          id: 'haunting-js-3',
          title: 'Unintended type coercion in input validation',
          line: 4,
          category: 'logic',
          severity: 'medium',
          explanation: '`userId == 0` blocks valid user ID 0 or string representations due to loose type coercion.',
          suggested_fix: 'Use strict validation `!userId && userId !== 0` or enforce positive numeric IDs.',
          original_snippet: '  if (userId == null || userId == 0) {',
          corrected_snippet: '  if (userId === null || userId === undefined || userId === "") {',
        },
      ],
      corrected_code: `// Exorcised User Authentication & Profile Handler
async function fetchUserProfile(userId) {
  if (userId === null || userId === undefined || userId === "") {
    throw new Error("Invalid user ID supplied");
  }

  const response = await fetch(\`/api/users/\${userId}\`);
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}: Failed to fetch user\`);
  }
  const data = await response.json();

  const primaryRole = data.roles?.[0]?.name ?? "guest";
  const displayName = (data.profile?.name ?? "Anonymous").toUpperCase();

  return {
    id: userId,
    role: primaryRole,
    name: displayName,
    token: generateToken(userId)
  };
}

function generateToken(id) {
  return "token_" + Math.random().toString(36).substring(2);
}
`,
      applied_fixes: [
        'Missing await on asynchronous fetch & json resolution',
        'Unsafe nested property access without null checks',
        'Unintended type coercion in input validation',
      ],
      unresolved_issues: [],
      analyzedAt: new Date().toISOString(),
    },
  },
  {
    id: 'sql-curse-injection',
    title: 'Cursed Dynamic Query & Cartesian Product',
    language: 'sql',
    fileName: 'haunted_queries.sql',
    description: 'SQL script containing critical SQL injection vulnerability, missing join predicate causing cartesian explosion, and non-indexed table scans.',
    knownHauntingsCount: 3,
    code: `-- Haunting 1: Direct string interpolation vulnerable to SQL Injection
SELECT * 
FROM users 
WHERE username = '' OR '1'='1'
  AND password_hash = '5f4dcc3b5aa765d61d8327deb882cf99';

-- Haunting 2: Cartesian Product (Cross Join) without ON clause
SELECT 
    orders.order_id, 
    orders.total_amount, 
    customers.email
FROM orders, customers;

-- Haunting 3: SELECT * with unindexed LIKE prefix
SELECT * 
FROM audit_logs 
WHERE action_type LIKE '%FAILED_LOGIN%'
ORDER BY timestamp DESC;
`,
    demoAnalysis: {
      language: 'sql',
      summary: 'Discovered 3 severe SQL hauntings: SQL injection surface through unparameterized query, massive Cartesian explosion from an implicit CROSS JOIN lacking a foreign key match, and expensive unindexed full table scans.',
      findings: [
        {
          id: 'haunting-sql-1',
          title: 'SQL Injection Vulnerability in Authentication Filter',
          line: 4,
          category: 'security',
          severity: 'critical',
          explanation: 'Interpolating raw user credentials directly into SQL enables authentication bypass using tautology injections such as `\' OR \'1\'=\'1`.',
          suggested_fix: 'Replace with parameterized prepared statements (`WHERE username = ? AND password_hash = ?`).',
          original_snippet: 'SELECT * \nFROM users \nWHERE username = \'\' OR \'1\'=\'1\'\n  AND password_hash = \'5f4dcc3b5aa765d61d8327deb882cf99\';',
          corrected_snippet: 'SELECT id, username, email, created_at \nFROM users \nWHERE username = :username \n  AND password_hash = :password_hash;',
        },
        {
          id: 'haunting-sql-2',
          title: 'Catastrophic Cartesian Product (Missing JOIN Predicate)',
          line: 11,
          category: 'performance',
          severity: 'critical',
          explanation: 'Using comma-separated table lists without an explicit join condition computes an N x M cartesian product, generating millions of incorrect rows and exhausting database memory.',
          suggested_fix: 'Use an explicit `INNER JOIN` with foreign key predicate `ON orders.customer_id = customers.id`.',
          original_snippet: 'FROM orders, customers;',
          corrected_snippet: 'FROM orders\nINNER JOIN customers ON orders.customer_id = customers.id;',
        },
        {
          id: 'haunting-sql-3',
          title: 'Leading Wildcard Scan & SELECT * Inefficiency',
          line: 17,
          category: 'performance',
          severity: 'medium',
          explanation: '`LIKE \'%...\'` with a leading wildcard bypasses B-tree index searches and forces a full table scan on `audit_logs`. Specifying `SELECT *` also strains network bandwidth.',
          suggested_fix: 'Specify required columns explicitly and search with exact match, full-text index, or prefix search `LIKE \'FAILED_LOGIN%\'`.',
          original_snippet: 'SELECT * \nFROM audit_logs \nWHERE action_type LIKE \'%FAILED_LOGIN%\'\nORDER BY timestamp DESC;',
          corrected_snippet: 'SELECT log_id, action_type, user_id, timestamp \nFROM audit_logs \nWHERE action_type = \'FAILED_LOGIN\'\nORDER BY timestamp DESC \nLIMIT 100;',
        },
      ],
      corrected_code: `-- Exorcised & Parameterized SQL Queries
SELECT id, username, email, created_at 
FROM users 
WHERE username = :username 
  AND password_hash = :password_hash;

SELECT 
    orders.order_id, 
    orders.total_amount, 
    customers.email
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;

SELECT log_id, action_type, user_id, timestamp 
FROM audit_logs 
WHERE action_type = 'FAILED_LOGIN'
ORDER BY timestamp DESC
LIMIT 100;
`,
      applied_fixes: [
        'SQL Injection Vulnerability in Authentication Filter',
        'Catastrophic Cartesian Product (Missing JOIN Predicate)',
        'Leading Wildcard Scan & SELECT * Inefficiency',
      ],
      unresolved_issues: [],
      analyzedAt: new Date().toISOString(),
    },
  },
];
