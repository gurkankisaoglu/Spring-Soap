package app.repos;

import app.database.Database;
import app.entities.User;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.sql.SQLException;

@Component
public class UserRepository{
    public Database database = new Database();
    public User user;




    @PostConstruct
    public void initData() throws IOException, SQLException {


    }



    public User findUser(String name) throws SQLException {
        Assert.notNull(name, "The country's name must not be null");
        return database.get(name);
    }

    public boolean loginControl(User user) throws SQLException {
        return database.loginControl(user);
    }


    public void initializeUser(User user1) {
        user = new User(user1.getUsername(),user1.getPassword(),user1.getEmail(),user1.getGender(),user1.getAddress(),user1.getAuthority());
    }

    public String getUserName(){
        return this.user.getUsername();
    }

    public boolean isAdmin(String name) throws SQLException {
        return database.isAdmin(name);
    }

    public boolean createUser(User user) throws SQLException {
        return database.createUser(user);
    }

    public boolean updateUser(String name, String changeIdentity , String newIdentity) throws IOException, SQLException {
        return database.updateUser(name, changeIdentity , newIdentity);
    }

    public boolean deleteUser(String name) throws SQLException, IOException {
        return database.deleteUser(name);
    }
}