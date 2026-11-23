import java.util.*;
public class Rechnen
{ 
 public static void main(String[] args)
{
Scanner Keyb = new Scanner(System.in);
int zahl1, zahl2, summe, differenz, produkt;

System.out.print("Erste ganze Zahl ="); zahl1=Keyb.nextInt();
System.out.print("Zweite ganze Zahl ="); zahl2=Keyb.nextInt();
summe=zahl1 + zahl2; 
differenz= zahl1 - zahl2;
produkt= zahl1*zahl2;
System.out.println("Summe ="+summe);
System.out.println("Differenz ="+differenz); 
System.out.println("Produkt ="+produkt);
} 
 } 





 

 