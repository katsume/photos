import java.util.Arrays;
import java.util.Iterator;
import processing.serial.*;

String[] SERIAL_NAMES= {
    "/dev/tty.usbmodem1411",
    "/dev/tty.usbmodem1421"
};
int FRAME_RATE= 60;
int REFRESH_COUNT= 10;
int FONT_SIZE= 10;

Serial[] serials= new Serial[SERIAL_NAMES.length];
ArrayList<ArrayList<Tag>> tags= new ArrayList<ArrayList<Tag>>();
Counter refreshCounter= new Counter(REFRESH_COUNT);
Page page= new Page(this);

void setup(){
    
    frameRate(FRAME_RATE);
    size(320, 240);

    for(int i=0; i<serials.length; i++){
        
        Serial serial= new Serial(this, SERIAL_NAMES[i], 115200);
        serial.bufferUntil('\n');
        serials[i]= serial;
        
        tags.add(new ArrayList<Tag>());
    }

    textSize(FONT_SIZE);
}

void draw(){

    background(0);
    
    if(refreshCounter.update()){

        refreshTags();

        page.refresh(tags.get(0).size(), tags.get(1).size());
    }
    
    //
    
    text(page.get(), 0, FONT_SIZE);

    for(int i=0; i<tags.size(); i++){
        for(int j=0; j<tags.get(i).size(); j++){
            text(tags.get(i).get(j).id(), i*(width/2), FONT_SIZE*(j+2));
        }
    }

}

void serialEvent(Serial serial){
    
    String id= serial.readStringUntil('\n');
    id= trim(id);

    int index= Arrays.asList(serials).indexOf(serial);
    boolean unique= true;
    Iterator it= tags.get(index).iterator();

    while(it.hasNext()){

        Tag tag= (Tag)it.next();
        if(tag.id().equals(id)){

            tag.extend();
            unique= false;
            break;
        }
    }

    if(unique && id.length()>1){
        tags.get(index).add(new Tag(id));
    }
    
    serial.write(' ');
}

void refreshTags(){
    
    for(int i=0; i<tags.size(); i++){
        
        Iterator it= tags.get(i).iterator();
        while(it.hasNext()){
            
            Tag tag= (Tag)it.next();
            if(tag.expired()){
                it.remove();
            }
        }
    }
}

