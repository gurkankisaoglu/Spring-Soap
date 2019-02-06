package app.repos;

import app.database.Database;
import app.entities.Message;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import javax.annotation.PostConstruct;
import javax.xml.datatype.DatatypeConfigurationException;
import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;

@Component
public class MessageRepository {
    public Database database = new Database();



    @PostConstruct
    public void initData() throws DatatypeConfigurationException, SQLException, ParseException {


    }

    public ArrayList<Message> findInSent(String name) throws SQLException {
        Assert.notNull(name, "The country's name must not be null");
        return database.getOutbox(name);
    }
    public ArrayList<Message> findInReceived(String name) throws SQLException {
        Assert.notNull(name, "The country's name must not be null");
        return database.getInbox(name);
    }

    public boolean sendMail(Message msg) throws IOException, SQLException {
        return database.sendMail(msg);
    }

}