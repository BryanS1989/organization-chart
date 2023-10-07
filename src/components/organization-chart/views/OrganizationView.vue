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
                                    },
                                    {
                                        name: "Ana Sanchez",
                                        position: "Junior Developer"
                                    },
                                    {
                                        name: "Michael Johnson",
                                        position: "Junior Developer"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Jane Doe",
                        position: "COO",
                        employees: [
                            {
                                name: "Maria Perez",
                                position: "Director of HR",
                                department: "Recursos Humanos",
                            },
                            {
                                name: "David Rodriguez",
                                position: "Hiring Manager"
                            }
                        ]
                    },
                    {
                        name: "Alice Brown",
                        position: "CFO",
                        employees: [
                            {
                                name: "Robert Wilson",
                                position: "Financial Analyst"
                            },
                            {
                                name: "Emily Davis",
                                position: "Accountant"
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