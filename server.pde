
/**
 * Shared Drawing Canvas (Server) 
 * by Alexander R. Galloway. 
 * 
 * A server that shares a drawing canvas between two computers. 
 * In order to open a socket connection, a server must select a 
 * port on which to listen for incoming clients and through which 
 * to communicate. Once the socket is established, a client may 
 * connect to the server and send or receive commands and data.
 * Get this program running and then start the Shared Drawing
 * Canvas (Client) program so see how they interact.
 */

 /**
 * Shared Drawing Canvas (Client) 
 * by Alexander R. Galloway. 
 * 
 * The Processing Client class is instantiated by specifying a remote 
 * address and port number to which the socket connection should be made. 
 * Once the connection is made, the client may read (or write) data to the server.
 * Before running this program, start the Shared Drawing Canvas (Server) program.
 */


import processing.net.*;


 Server s;//for the server
 Client c;//
 String input;
 int data[];

 ///////////////////////////////////////////////////////SERVER///////////////////////////////////////////////////////

 void setupServer(){
   s = new Server(this, 12345); // Start a simple server on a port
 }

void connectServer(){
    if (mousePressed == true) {
    // Draw our line
    stroke(255);
    line(pmouseX, pmouseY, mouseX, mouseY);
    // Send mouse coords to other person
    s.write(pmouseX + " " + pmouseY + " " + mouseX + " " + mouseY + "\n");
  }
  // Receive data from client
  c = s.available();
  if (c != null) {
    input = c.readString();
    input = input.substring(0, input.indexOf("\n")); // Only up to the newline
    data = int(split(input, ' ')); // Split values into an array
    // Draw line using received coords
    stroke(0);
    line(data[0], data[1], data[2], data[3]);
  }
}
///////////////////////////////////////////////////////CLIENT///////////////////////////////////////////////////////

 void setupClient(){
   size(450, 255);
   background(204);
   stroke(0);
   // Connect to the server's IP address and port
   c = new Client(this, "127.0.0.1", 12345); // Replace with your server's IP and port
 }
 
 void connectClient(){
   if (mousePressed == true) {
     // Draw our line
     stroke(255);
     line(pmouseX, pmouseY, mouseX, mouseY);
     // Send mouse coords to other person
     c.write(pmouseX + " " + pmouseY + " " + mouseX + " " + mouseY + "\n");
   }
   // Receive data from server
   if (c.available() > 0) {
     input = c.readString();
     input = input.substring(0, input.indexOf("\n")); // Only up to the newline
     data = int(split(input, ' ')); // Split values into an array
     // Draw line using received coords
     stroke(0);
     line(data[0], data[1], data[2], data[3]);
   }
 }
