<?php
include 'session.php';
include 'dbconn.php';

if (!isset($_GET['orderid'])) {
    echo "Order ID not provided.";
    exit();
}

$orderid = intval($_GET['orderid']);

$sql =  "SELECT p.brand, p.name, op.stockid, op.quantity, op.type, op.value, op.orderid, o.orderid, o.userid, u.userid, u.email 
        FROM orderproducts op
        JOIN products p on op.stockid = p.stockid
        JOIN orders o on op.orderid = o.orderid
        JOIN users u on o.userid = u.userid
        WHERE op.orderid =?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo "Failed to prepare the SQL statement: " . htmlspecialchars($conn->error);
    exit();
}

$stmt->bind_param('i', $orderid);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo '<h4>Order Details for Order No: ' . htmlspecialchars($orderid) . '</h4>';
    echo '<table class="table table-bordered p-4 p-md-5 border rounded-3 bg-body-tertiary">';
    echo '<thead><tr><th>Product Name</th><th>Custom</th><th>Name/Initial</th><th>Qty</th></tr></thead>';
    echo '<tbody>';
    while ($row = $result->fetch_assoc()) {
        echo '<tr>';
        echo '<td>'. htmlspecialchars($row['brand']).': ' . htmlspecialchars($row['name']) . '</td>';
        echo '<td>' . htmlspecialchars($row['type']) . '</td>';
        echo '<td>' . htmlspecialchars($row['value']) . '</td>';
        echo '<td>' . htmlspecialchars($row['quantity']) . '</td>';
        echo '</tr>';
    }
    echo '</tbody>';
    echo '</table>';
} else {
    echo 'No details found for this order.';
}
$stmt->close();
?>