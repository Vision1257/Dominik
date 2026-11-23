package pkg20_gui_rnd_clr;

import java.awt.*;
import java.awt.event.*;
import java.util.*;

public class Main {

    public static void main(String[] args) {

        Random rnd = new Random();
        
            
        

        int i;
        for (i = 0; i < 900; i++) {
            Ausgabe f1 = new Ausgabe();
            int a = rnd.nextInt(1500);
            int b = rnd.nextInt(1500);
            f1.setLocation( a, b);

        }

    }

}

class Ausgabe extends Frame {

    Ausgabe() {
        this.setSize(300, 300);
        this.setVisible(true);

        Random rnd = new Random();
        int r = rnd.nextInt(256);
        int g = rnd.nextInt(256);
        int b = rnd.nextInt(256);

        Color C = new Color(r, g, b);
        
        class WinListKlasse extends WindowAdapter{
            
            public void windowClosing(WindowEvent e){
                System.exit(0);
            };
            
        }
        WinListKlasse W1=new WinListKlasse();
        this.addWindowListener(W1);
        
        

        this.setBackground(C);

    }

}
