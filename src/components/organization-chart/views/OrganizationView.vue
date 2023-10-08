<script>
import OrganizationChart from './../components/OrganizationChart.vue'

export default {
    name: 'OrganizationView',
    components: {
        OrganizationChart
    },
    data() {
        return {
            organization: {
                name: "My Company",
                description: "A fictitious company",
                founded: "2000",
                location: "Example City",
                employees: [
                    {
                        name: "John Smith",
                        position: "CEO",
                        employees: [
                            {
                                name: "Laura Garcia",
                                position: "Director of Sales",
                                department: "Ventas"
                            },
                            {
                                name: "Elena Martinez",
                                position: "Director of Development",
                                department: "Producto",
                                employees: [
                                    {
                                        name: "Luis Fernandez",
                                        position: "Senior Developer",
                                        department: "Producto",
                                        email: "l.fernandez@email.com",
                                    },
                                    {
                                        name: "Ana Sanchez",
                                        position: "Junior Developer",
                                        department: "Producto",
                                        email: "a.sanchez@email.com",
                                    },
                                    {
                                        name: "Michael Johnson",
                                        position: "Junior Developer",
                                        department: "Producto",
                                        email: "m.johnson@email.com",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Jane Doe",
                        position: "COO",
                        email: "j.doe@email.com",
                        employees: [
                            {
                                name: "Maria Perez",
                                position: "Director of HR",
                                department: "Recursos Humanos",
                            },
                            {
                                name: "David Rodriguez",
                                position: "Hiring Manager",
                                department: "Recursos Humanos",
                                email: "d.rodriguez@email.com",
                            }
                        ]
                    },
                    {
                        name: "Alice Brown",
                        position: "CFO",
                        department: "Finanzas",
                        email: "a.brown@email.com",
                        employees: [
                            {
                                name: "Robert Wilson",
                                position: "Financial Analyst",
                                department: "Finanzas",
                                email: "r.wilson@email.com",
                            },
                            {
                                name: "Emily Davis",
                                position: "Accountant",
                                department: "Finanzas",
                                email: "e.davis@email.com",
                            }
                        ]
                    },
                    {
                        name: "William Turner",
                        position: "CTO",
                        employees: [
                            {
                                name: "Sophia Lewis",
                                position: "Lead Engineer"
                            },
                            {
                                name: "Daniel White",
                                position: "Software Engineer"
                            },
                            {
                                name: "Olivia Harris",
                                position: "Software Engineer"
                            },
                            {
                                name: "Alexander Green",
                                position: "QA Engineer"
                            }
                        ]
                    },
                    {
                        name: "Susan Clark",
                        position: "CMO",
                        department: "Marketing",
                        employees: [
                            {
                                name: "Jennifer King",
                                position: "Marketing Manager",
                                department: "Marketing",
                            },
                            {
                                name: "Matthew Scott",
                                position: "Marketing Specialist",
                                department: "Marketing",
                            }
                        ]
                    }
                ]
            }

        }
    }
}
</script>

<template>
    <main class="flex flex-col justify-start items-start gap-2">
        <h2 class="text-2xl">My Company Organization Chart</h2>
        <article class="rounded w-full">
            <OrganizationChart :chartInfo="organization" />
        </article>
    </main>
</template>