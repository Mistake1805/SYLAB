package com.example.syllabus.services;

import com.example.syllabus.models.*;
import com.example.syllabus.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SemesterRepository semesterRepository;

    public DataSeeder(SemesterRepository semesterRepository) {
        this.semesterRepository = semesterRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (semesterRepository.count() == 0) {
            Semester sem4 = new Semester();
            sem4.setName("Semester 4");
            sem4.setActiveStatus(true);

            // You can build out nested initial subjects/modules/topics here
            semesterRepository.save(sem4);
            System.out.println("Initial seed data populated successfully!");
        }
    }
}