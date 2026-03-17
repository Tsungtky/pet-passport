package com.petpassport.backend;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Bean
    @Primary
    public DataSource dataSource() throws Exception {
        if (databaseUrl != null && !databaseUrl.isBlank()) {
            URI uri = new URI(databaseUrl.replace("postgresql://", "http://"));
            String host = uri.getHost();
            int port = uri.getPort();
            String path = uri.getPath();
            String[] userInfo = uri.getUserInfo().split(":", 2);
            String username = userInfo[0];
            String password = userInfo[1];

            HikariConfig config = new HikariConfig();
            config.setJdbcUrl("jdbc:postgresql://" + host + ":" + port + path);
            config.setUsername(username);
            config.setPassword(password);
            return new HikariDataSource(config);
        }

        // fallback for local dev
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:postgresql://localhost:5432/petpassport");
        config.setUsername("nicktraining");
        config.setPassword("");
        return new HikariDataSource(config);
    }
}
