# Connecting The Database

You'll need a MySQL database to use SamsiMetric, here's how you can connect it.

> This guide assumes you have already created a seperate database, exclusively for SamsiMetric

## Using Docker Environment Variables

You can use docker environment variables to connect to the database.

Your docker container should have the following variables defined:

- `DB_USERNAME`: The username used to connect to MySQL
- `DB_HOST`: The address of the MySQL server (use localhost if it's on the same machine)
- `DB_PASSWORD`: The password used to connect to MySQL (in plain text)
- `DB_ANALYTICS`: The name of the database that you have created SamsiMetric

## Using A .env File (Non-Docker Install)

A .env file stores environment variables used by SamsiMetric.
SamsiMetric will try to find a .env file up to 3 directories above the root. We recommend creating one outside the web root to prevent leaking your credentials.  

Here is an example of what a .env should look like:

```
DB_USERNAME=root
DB_HOST=localhost
DB_PASSWORD=password
DB_ANALYTICS=analytics_db
```

See "Using Docker Environment Variables" section to know what the environment variables do.

# Formatting The Database

Once you have a database connected to SamsiMetric, you'll have to format it. Formatting the database will apply all necessary tables and default data.

> Warning:  
> When formatting a database, make sure it's empty, forgetting to do so may result in data loss.

## Automatic Formatting

If SamsiMetric detects that an empty database was provided, you will be redirected to the database format page, where you can click the format button. This is the easiest way to get your database up and running with SamsiMetric.

```accordion
[
    {
        "title": "What If The Database Format Failed?",
        "content": "Make sure your MySQL version is up to date, if it still fails, proceed with the manual formatting."
    }
]
```

## Manual Formatting

If automatic formatting fails, it may be an issue with your configuration. If you still want to attempt to use SamsiMetric, you can manually format your database.

Here's how to do it:

- Download the [SQL file](https://raw.githubusercontent.com/SamsidParty/SamsiMetric/main/Templates/SQL/initial.sql)
- Open your database in phpMyAdmin
- Click "Import" at the top
- Choose the SQL file you downloaded
- Click "Import" at the bottom

If everything was done correctly, you should see all the required tables added to the database.